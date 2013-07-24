package com.goodow.drive.android.toolutils;

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

public class OfflineFileObserver {
	private Document doc;
	private static Model model;
	private CollaborativeMap root;
	private static CollaborativeList list;

	private static final String OFFLINE = "offline";

	private EventHandler<ValuesAddedEvent> listAddEventHandler;
	private EventHandler<ValuesRemovedEvent> listRemoveEventHandler;

	public static CollaborativeList getList() {
		return list;
	}

	public static void addFile(CollaborativeMap file) {
		if (null != file) {
			CollaborativeMap newFile = model.createMap(null);
			newFile.set("title", file.get("label"));
			newFile.set("url", file.get("url"));
			newFile.set("progress", "0");
			newFile.set("status", file.get("status"));
			newFile.set("blobKey", file.get("blobKey"));

			list.push(newFile);
		}
	}

	public static void removeFile(CollaborativeMap file) {
		// TODO
	}

	public void startObservation(String docId) {

		initEventHandler();

		DocumentLoadedHandler onLoaded = new DocumentLoadedHandler() {
			@Override
			public void onLoaded(Document document) {
				doc = document;
				model = doc.getModel();
				root = model.getRoot();

				list = root.get(OFFLINE);
				list.addValuesAddedListener(listAddEventHandler);
				list.addValuesRemovedListener(listRemoveEventHandler);
			}
		};

		ModelInitializerHandler initializer = new ModelInitializerHandler() {
			@Override
			public void onInitializer(Model model_) {
				model = model_;
				root = model.getRoot();

				root.set(OFFLINE, model.createList());
			}
		};

		Realtime.load(docId, onLoaded, initializer, null);
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
							DownloadResServiceBinder
									.getDownloadResServiceBinder()
									.addResDownload(resource);
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
