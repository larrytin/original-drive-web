package com.goodow.drive.android.toolutils;

import java.io.File;
import java.io.IOException;
import java.lang.Thread.State;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;
import com.goodow.api.services.attachment.Attachment;
import com.goodow.api.services.attachment.Attachment.Get;
import com.goodow.drive.android.global_data_cache.GlobalConstant;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
import com.goodow.drive.android.module.DriveModule;
import com.goodow.realtime.CollaborativeList;
import com.goodow.realtime.CollaborativeMap;
import com.goodow.realtime.Document;
import com.goodow.realtime.DocumentLoadedHandler;
import com.goodow.realtime.EventHandler;
import com.goodow.realtime.Model;
import com.goodow.realtime.ModelInitializerHandler;
import com.goodow.realtime.Realtime;
import com.goodow.realtime.ValuesAddedEvent;
import com.goodow.realtime.ValuesRemovedEvent;

import elemental.json.JsonObject;

public class OfflineFileObserver {
	private static BlockingQueue<JsonObject> unLoginDownloadQueue = new LinkedBlockingDeque<JsonObject>();

	private Document doc;
	private static Model model;
	private CollaborativeMap root;
	private static CollaborativeList list;

	private static Model model_unlogin;
	private static CollaborativeList list_unlogin;

	private static final String OFFLINE = "offline";

	private EventHandler<ValuesAddedEvent> listAddEventHandler;
	private EventHandler<ValuesRemovedEvent> listRemoveEventHandler;

	private UnloginDownloadThread unloginDownloadThread = new UnloginDownloadThread();

	private class UnloginDownloadThread extends Thread {
		@Override
		public void run() {
			try {
				while (true) {
					JsonObject json = unLoginDownloadQueue.take();
					String attachmentId = json.getString("attachmentId");

					addFile(null, attachmentId);
				}
			} catch (Exception exception) {
				exception.printStackTrace();
			}
		}
	}

	public void addAttachment(JsonObject json) {
		unLoginDownloadQueue.add(json);
	}

	public static CollaborativeList getList() {
		return list;
	}

	public static void addFile(CollaborativeMap file, String attachmentId) {
		CollaborativeMap newFile;

		if (null != file) {
			out: do {
				for (int i = 0; i < list.length(); i++) {
					CollaborativeMap map = list.get(i);
					if (file.get("blobKey").equals(map.get("blobKey"))) {
						break out;
					}
				}

				newFile = model.createMap(null);
				newFile.set("title", file.get("label"));
				newFile.set("type", file.get("type"));
				newFile.set("url", file.get("url"));
				newFile.set("progress", "0");
				newFile.set("status",
						GlobalConstant.DownloadStatusEnum.WAITING.getStatus());
				newFile.set("blobKey", file.get("blobKey"));

				list.push(newFile);
			} while (false);

		} else if (null != attachmentId) {
			try {
				Attachment attachment = MyApplication.getAttachment();
				Get get = attachment.get(attachmentId);
				com.goodow.api.services.attachment.model.Attachment execute = get
						.execute();

				out: do {
					if (null == execute) {
						break out;
					}

					for (int i = 0; i < list_unlogin.length(); i++) {
						CollaborativeMap map = list_unlogin.get(i);
						if (execute.getBlobKey().equals(map.get("blobKey"))) {
							break out;
						}
					}

					newFile = model_unlogin.createMap(null);
					newFile.set("title", execute.getFilename());

					for (SomeEnums.MIME_TYPE_Table mimeType : SomeEnums.MIME_TYPE_Table
							.values()) {
						if (execute.getContentType().equals(
								mimeType.getMimeType())) {
							newFile.set("type", mimeType.getType());

						}
					}

					newFile.set("url", DriveModule.DRIVE_SERVER + "/serve?id="
							+ attachmentId);
					newFile.set("progress", "0");
					newFile.set("status",
							GlobalConstant.DownloadStatusEnum.WAITING
									.getStatus());
					newFile.set("blobKey", execute.getBlobKey());

					list_unlogin.push(newFile);
				} while (false);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public static void removeFile(CollaborativeMap file) {
		// TODO
	}

	public OfflineFileObserver startObservation(String docId,
			final boolean isLogin) {

		initEventHandler();

		DocumentLoadedHandler onLoaded = new DocumentLoadedHandler() {
			@Override
			public void onLoaded(Document document) {
				doc = document;

				if (isLogin) {
					model = doc.getModel();
					root = model.getRoot();

					list = root.get(OFFLINE);
					list.addValuesAddedListener(listAddEventHandler);
					list.addValuesRemovedListener(listRemoveEventHandler);
				} else {
					model_unlogin = doc.getModel();
					root = model_unlogin.getRoot();

					list_unlogin = root.get(OFFLINE);
					list_unlogin.addValuesAddedListener(listAddEventHandler);
					list_unlogin
							.addValuesRemovedListener(listRemoveEventHandler);

					State state = unloginDownloadThread.getState();
					switch (state) {
					case BLOCKED:
						break;

					case NEW:
						unloginDownloadThread.start();

						break;

					case RUNNABLE:

						break;

					case TERMINATED:
						unloginDownloadThread = new UnloginDownloadThread();
						unloginDownloadThread.start();

						break;

					case TIMED_WAITING:

						break;
					default:
						break;
					}
				}
			}
		};

		ModelInitializerHandler initializer = new ModelInitializerHandler() {
			@Override
			public void onInitializer(Model model_) {
				if (isLogin) {
					model = model_;
					root = model.getRoot();

					root.set(OFFLINE, model.createList());
					
				} else {
					model_unlogin = model_;
					root = model_unlogin.getRoot();

					root.set(OFFLINE, model_unlogin.createList());
					
				}
			}
		};

		Realtime.load(docId, onLoaded, initializer, null);

		return this;
	}

	public void initEventHandler() {
		if (listAddEventHandler == null) {
			listAddEventHandler = new EventHandler<ValuesAddedEvent>() {
				@Override
				public void handleEvent(ValuesAddedEvent event) {
					Object[] adds = event.getValues();

					if (null != adds) {
						for (Object o : adds) {
							CollaborativeMap resource = (CollaborativeMap) o;
							File file = new File(
									GlobalDataCacheForMemorySingleton.getInstance
											.getOfflineResDirPath()
											+ "/"
											+ resource.get("blobKey"));

							if (!file.exists()) {
								DownloadResServiceBinder
										.getDownloadResServiceBinder()
										.addResDownload(resource);
							} else {
								resource.set("progress", "100");
								resource.set(
										"status",
										GlobalConstant.DownloadStatusEnum.COMPLETE
												.getStatus());
							}
						}
					}
				}
			};
		}

		if (listRemoveEventHandler == null) {
			listRemoveEventHandler = new EventHandler<ValuesRemovedEvent>() {
				@Override
				public void handleEvent(ValuesRemovedEvent event) {
					Object[] adds = event.getValues();

					if (null != adds) {
						for (Object o : adds) {
							CollaborativeMap resource = (CollaborativeMap) o;
							DownloadResServiceBinder
									.getDownloadResServiceBinder()
									.removeResDownload(resource);
						}
					}
				}
			};
		}
	}
}
