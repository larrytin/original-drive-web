package com.goodow.drive.android.fragment;

import java.io.File;

import android.app.ListFragment;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.goodow.android.drive.R;
import com.goodow.drive.android.Interface.IRemoteDataFragment;
import com.goodow.drive.android.activity.MainActivity;
import com.goodow.drive.android.activity.play.AudioPlayActivity;
import com.goodow.drive.android.activity.play.VideoPlayActivity;
import com.goodow.drive.android.adapter.CollaborativeAdapter;
import com.goodow.drive.android.global_data_cache.GlobalConstant;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
import com.goodow.drive.android.toolutils.SomeEnums;
import com.goodow.realtime.BaseModelEvent;
import com.goodow.realtime.CollaborativeList;
import com.goodow.realtime.CollaborativeMap;
import com.goodow.realtime.Document;
import com.goodow.realtime.DocumentLoadedHandler;
import com.goodow.realtime.EventHandler;
import com.goodow.realtime.EventType;
import com.goodow.realtime.Model;
import com.goodow.realtime.ModelInitializerHandler;
import com.goodow.realtime.Realtime;
import com.goodow.realtime.ValueChangedEvent;
import com.goodow.realtime.ValuesAddedEvent;
import com.goodow.realtime.ValuesRemovedEvent;
import com.goodow.realtime.ValuesSetEvent;

public class LessonListFragment extends ListFragment implements
		IRemoteDataFragment {
	private CollaborativeList historyOpenedFolders;
	private CollaborativeMap currentFolder;

	private CollaborativeAdapter adapter;

	private Document doc;
	private Model model;
	private CollaborativeMap root;

	private static final String FOLDER_KEY = "folders";
	private static final String FILE_KEY = "files";
	private static final String PATH_KEY = "path";

	private EventHandler<ValuesAddedEvent> pathValuesAddedEventHandler;
	private EventHandler<ValuesRemovedEvent> pathValuesRemovedEventHandler;
	// private EventHandler<ValuesSetEvent> pathValuesSetEventHandler;

	private EventHandler<?> listEventHandler;

	private EventHandler<ValueChangedEvent> valuesChangeEventHandler;

	public void backFragment() {
		if (1 < historyOpenedFolders.length()) {
			CollaborativeList chilFolders = (CollaborativeList) ((CollaborativeMap) historyOpenedFolders
					.get(historyOpenedFolders.length() - 1)).get(FOLDER_KEY);

			// 删除监听
			if (null != chilFolders) {
				CollaborativeList chilFiles = (CollaborativeList) ((CollaborativeMap) historyOpenedFolders
						.get(historyOpenedFolders.length() - 1)).get(FILE_KEY);

				for (int i = 0; i < chilFolders.length(); i++) {
					CollaborativeMap map = chilFolders.get(i);
					removeMapListener(map);
				}

				for (int i = 0; i < chilFiles.length(); i++) {
					CollaborativeMap map = chilFiles.get(i);
					removeMapListener(map);
				}

				removeListListener(chilFolders);
				removeListListener(chilFiles);
			}

			historyOpenedFolders.remove(historyOpenedFolders.length() - 1);

		} else {
			Toast.makeText(getActivity(), R.string.backFolderErro,
					Toast.LENGTH_SHORT).show();
		}
	}

	public void connectUi() {
		historyOpenedFolders = root.get(PATH_KEY);

		historyOpenedFolders
				.addValuesAddedListener(pathValuesAddedEventHandler);
		historyOpenedFolders
				.addValuesRemovedListener(pathValuesRemovedEventHandler);

		if (0 == historyOpenedFolders.length()) {
			historyOpenedFolders.push(root);
		}

		if (null != currentFolder) {
			initData();
		}
	}

	public void initData() {
		if (null != currentFolder) {
			CollaborativeList folderList = (CollaborativeList) currentFolder
					.get(FOLDER_KEY);
			CollaborativeList fileList = (CollaborativeList) currentFolder
					.get(FILE_KEY);

			adapter.setFolderList(folderList);
			adapter.setFileList(fileList);
			adapter.notifyDataSetChanged();

			if (null != folderList) {
				setListListener(folderList);
			}

			if (null != fileList) {
				setListListener(fileList);
			}

			// 设置action bar的显示
			if (historyOpenedFolders.length() <= 1) {
				((MainActivity) getActivity()).restActionBarTitle();

			} else {
				StringBuffer title = new StringBuffer();
				for (int i = 0; i < historyOpenedFolders.length(); i++) {
					String label = ((CollaborativeMap) historyOpenedFolders
							.get(i)).get("label");
					if (null != label) {
						title.append("/" + label);
					}
				}

				((MainActivity) getActivity()).setActionBarTitle(title
						.toString());
			}
		}
	}

	@Override
	public void onPause() {
		super.onPause();

		((MainActivity) getActivity()).restActionBarTitle();
	}

	@Override
	public void onActivityCreated(Bundle savedInstanceState) {
		super.onActivityCreated(savedInstanceState);

		MainActivity activity = (MainActivity) getActivity();

		activity.setIRemoteFrament(this);
		activity.setLastiRemoteDataFragment(this);

		TextView textView = (TextView) ((MainActivity) getActivity())
				.findViewById(R.id.openfailure_text);
		ImageView imageView = (ImageView) ((MainActivity) getActivity())
				.findViewById(R.id.openfailure_img);
		activity.setOpenStateView(textView, imageView);

	}

	private void initEventHandler() {
		if (listEventHandler == null) {
			listEventHandler = new EventHandler<BaseModelEvent>() {
				@Override
				public void handleEvent(BaseModelEvent event) {
					adapter.notifyDataSetChanged();

					openState();
				}
			};
		}

		if (pathValuesAddedEventHandler == null) {
			pathValuesAddedEventHandler = new EventHandler<ValuesAddedEvent>() {
				@Override
				public void handleEvent(ValuesAddedEvent event) {
					if (0 != historyOpenedFolders.length()) {
						CollaborativeMap map = (CollaborativeMap) historyOpenedFolders
								.get(historyOpenedFolders.length() - 1);
						if (null == map.get(FOLDER_KEY)) {

							File file = new File(
									GlobalDataCacheForMemorySingleton.getInstance
											.getOfflineResDirPath()
											+ "/"
											+ map.get("blobKey"));

							if (file.exists()) {
								Intent intent = null;

								String resPath = GlobalDataCacheForMemorySingleton.getInstance
										.getOfflineResDirPath() + "/";

								if (GlobalConstant.SupportResTypeEnum.MP3
										.getTypeName().equals(map.get("type"))) {
									intent = new Intent(getActivity(),
											AudioPlayActivity.class);

									intent.putExtra(
											AudioPlayActivity.IntentExtraTagEnum.MP3_NAME
													.name(), (String) map
													.get("label"));
									intent.putExtra(
											AudioPlayActivity.IntentExtraTagEnum.MP3_PATH
													.name(),
											resPath
													+ (String) map
															.get("blobKey"));
								} else if (GlobalConstant.SupportResTypeEnum.MP4
										.getTypeName().equals(map.get("type"))) {
									intent = new Intent(getActivity(),
											VideoPlayActivity.class);

									intent.putExtra(
											VideoPlayActivity.IntentExtraTagEnum.MP4_NAME
													.name(), (String) map
													.get("label"));
									intent.putExtra(
											VideoPlayActivity.IntentExtraTagEnum.MP4_PATH
													.name(),
											resPath
													+ (String) map
															.get("blobKey"));
								} else if (GlobalConstant.SupportResTypeEnum.FLASH
										.getTypeName().equals(map.get("type"))) {
									// TODO
								} else {
									intent = new Intent();

									intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
									intent.setAction(Intent.ACTION_VIEW);
									String type = SomeEnums.getMIMEType((String) map
											.get("type"));
									intent.setDataAndType(Uri.fromFile(file),
											type);
								}

								getActivity().startActivity(intent);
							} else {
								Toast.makeText(getActivity(), "请先下载该文件.",
										Toast.LENGTH_SHORT).show();
							}

							backFragment();
						} else {
							currentFolder = historyOpenedFolders
									.get(historyOpenedFolders.length() - 1);

							initData();

							openState();
						}
					}
				}
			};
		}

		if (pathValuesRemovedEventHandler == null) {
			pathValuesRemovedEventHandler = new EventHandler<ValuesRemovedEvent>() {
				@Override
				public void handleEvent(ValuesRemovedEvent event) {
					if (0 != historyOpenedFolders.length()) {
						currentFolder = historyOpenedFolders
								.get(historyOpenedFolders.length() - 1);
					} else {
						historyOpenedFolders.push(root);
					}

					initData();

					openState();
				}
			};
		}

		if (valuesChangeEventHandler == null) {
			valuesChangeEventHandler = new EventHandler<ValueChangedEvent>() {
				@Override
				public void handleEvent(ValueChangedEvent event) {
					String eventProperty = event.getProperty();
					if (eventProperty.equals("label")) {
						adapter.notifyDataSetChanged();
					}
				}
			};
		}
	}

	private void openState() {
		CollaborativeList folderList = currentFolder.get(FOLDER_KEY);
		CollaborativeList fileList = currentFolder.get(FILE_KEY);

		if (null != folderList && 0 == folderList.length() && null != fileList
				&& 0 == fileList.length()) {
			((MainActivity) getActivity()).openState(LinearLayout.VISIBLE);
		} else {
			((MainActivity) getActivity()).openState(LinearLayout.INVISIBLE);
		}
	}

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		adapter = new CollaborativeAdapter(this, null, null);
		setListAdapter(adapter);

		initEventHandler();

		// 文件Document
		DocumentLoadedHandler onLoaded = new DocumentLoadedHandler() {
			@Override
			public void onLoaded(Document document) {
				doc = document;
				model = doc.getModel();
				root = model.getRoot();

				connectUi();
			}
		};

		ModelInitializerHandler initializer = new ModelInitializerHandler() {
			@Override
			public void onInitializer(Model model_) {
				model = model_;
				root = model.getRoot();

				String[] mapKey = { "label", FILE_KEY, FOLDER_KEY };
				CollaborativeMap[] values = new CollaborativeMap[3];

				for (int k = 0; k < values.length; k++) {
					CollaborativeMap map = model.createMap(null);
					for (int i = 0; i < mapKey.length; i++) {
						if ("label".equals(mapKey[i])) {
							map.set(mapKey[i], "Folder" + k);
						} else {
							CollaborativeList subList = model.createList();

							if (FOLDER_KEY.equals(mapKey[i])) {
								CollaborativeMap subMap = model.createMap(null);
								subMap.set("label", "SubFolder");
								subMap.set(FILE_KEY, model.createList());
								subMap.set(FOLDER_KEY, model.createList());
								subList.push(subMap);
							}

							map.set(mapKey[i], subList);
						}
					}

					values[k] = map;
				}

				CollaborativeList list = model_.createList();
				list.pushAll((Object[]) values);

				root.set("folders", list);

				list = model_.createList();
				root.set("path", list);
			}
		};

		String docId = "@tmp/"
				+ GlobalDataCacheForMemorySingleton.getInstance().getUserId()
				+ "/lesson";

		// String docId = "@tmp/"
		// + GlobalDataCacheForMemorySingleton.getInstance().getUserId()
		// + "/androidTest002";

		Realtime.load(docId, onLoaded, initializer, null);

	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		return inflater.inflate(R.layout.fragment_folderlist, container, false);
	}

	@Override
	public void onListItemClick(ListView l, View v, int position, long id) {
		CollaborativeMap clickItem = (CollaborativeMap) v.getTag();

		historyOpenedFolders.push(clickItem);
	}

	@SuppressWarnings("unchecked")
	private void setListListener(CollaborativeList listenerList) {
		listenerList
				.addValuesSetListener((EventHandler<ValuesSetEvent>) listEventHandler);
		listenerList
				.addValuesRemovedListener((EventHandler<ValuesRemovedEvent>) listEventHandler);
		listenerList
				.addValuesAddedListener((EventHandler<ValuesAddedEvent>) listEventHandler);
	}

	private void removeListListener(CollaborativeList listenerList) {
		listenerList.removeListListener(listEventHandler);
	}

	public void setMapListener(CollaborativeMap listenerMap) {
		listenerMap.addValueChangedListener(valuesChangeEventHandler);
	}

	public void removeMapListener(CollaborativeMap listenerMap) {
		listenerMap.removeEventListener(EventType.VALUE_CHANGED,
				valuesChangeEventHandler, false);
	}

}
