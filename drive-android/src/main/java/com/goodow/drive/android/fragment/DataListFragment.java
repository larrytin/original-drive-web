package com.goodow.drive.android.fragment;

import android.app.ListFragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.Toast;
import com.goodow.drive.android.R;
import com.goodow.drive.android.activity.MainActivity;
import com.goodow.drive.android.adapter.CollaborativeAdapter;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
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

public class DataListFragment extends ListFragment {
	private MainActivity activity;

	private CollaborativeList historyOpenedFolders;
	private CollaborativeMap currentFolder;

	private CollaborativeAdapter adapter;

	private Document doc;
	private Model model;
	private CollaborativeMap root;

	private static final String FOLDER_KEY = "folderschild";
	private static final String FILE_KEY = "filechild";
	private static final String PATH_KEY = "path";

	private EventHandler<ValuesAddedEvent> pathValuesAddedEventHandler;
	private EventHandler<ValuesRemovedEvent> pathValuesRemovedEventHandler;
	// private EventHandler<ValuesSetEvent> pathValuesSetEventHandler;

	private EventHandler<ValuesAddedEvent> valuesAddedEventHandler;
	private EventHandler<ValuesRemovedEvent> valuesRemovedEventHandler;
	private EventHandler<ValuesSetEvent> valuesSetEventHandler;

	private EventHandler<ValueChangedEvent> valuesChangeEventHandler;

	public void backFragment() {
		if (1 < historyOpenedFolders.length()) {
			CollaborativeList chilFolders = (CollaborativeList) ((CollaborativeMap) historyOpenedFolders
					.get(historyOpenedFolders.length() - 1)).get(FOLDER_KEY);

			// remove监听
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
		}
	}

	@Override
	public void onPause() {
		super.onPause();
		activity.setIsDataListFragmentIn(false);
	}

	@Override
	public void onActivityCreated(Bundle savedInstanceState) {
		super.onActivityCreated(savedInstanceState);
		activity = (MainActivity) this.getActivity();
		activity.setIsDataListFragmentIn(true);

	}

	private void initEventHandler() {
		if (valuesAddedEventHandler == null) {
			valuesAddedEventHandler = new EventHandler<ValuesAddedEvent>() {
				@Override
				public void handleEvent(ValuesAddedEvent event) {
					adapter.notifyDataSetChanged();
				}
			};
		}

		if (valuesRemovedEventHandler == null) {
			valuesRemovedEventHandler = new EventHandler<ValuesRemovedEvent>() {
				@Override
				public void handleEvent(ValuesRemovedEvent event) {
					adapter.notifyDataSetChanged();
				}
			};
		}

		if (valuesSetEventHandler == null) {
			valuesSetEventHandler = new EventHandler<ValuesSetEvent>() {
				@Override
				public void handleEvent(ValuesSetEvent event) {
					adapter.notifyDataSetChanged();
				}
			};
		}

		if (pathValuesAddedEventHandler == null) {
			pathValuesAddedEventHandler = new EventHandler<ValuesAddedEvent>() {
				@Override
				public void handleEvent(ValuesAddedEvent event) {
					if (0 != historyOpenedFolders.length()) {

						if (null == ((CollaborativeMap) historyOpenedFolders
								.get(historyOpenedFolders.length() - 1))
								.get(FOLDER_KEY)) {

							// TODO
							Toast.makeText(DataListFragment.this.getActivity(),
									"你打开了一个文件!正在播放...", Toast.LENGTH_SHORT)
									.show();

							backFragment();
						} else {
							currentFolder = historyOpenedFolders
									.get(historyOpenedFolders.length() - 1);

							initData();
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

				String[] mapKey = { "label", "filechild", "folderschild" };
				CollaborativeMap[] values = new CollaborativeMap[3];

				for (int k = 0; k < values.length; k++) {
					CollaborativeMap map = model.createMap(null);
					for (int i = 0; i < mapKey.length; i++) {
						if ("label".equals(mapKey[i])) {
							map.set(mapKey[i], "Folder" + k);
						} else {
							CollaborativeList subList = model.createList();

							if ("folderschild".equals(mapKey[i])) {
								CollaborativeMap subMap = model.createMap(null);
								subMap.set("label", "SubFolder");
								subMap.set("filechild", model.createList());
								subMap.set("folderschild", model.createList());
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

		// String docId = "@tmp/"
		// + GlobalDataCacheForMemorySingleton.getInstance().getUserId()
		// + "/androidTest02";

		String docId = "@tmp/"
				+ GlobalDataCacheForMemorySingleton.getInstance().getUserId()
				+ "/androidTest001";
		Realtime.load(docId, onLoaded, initializer, null);

	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		return inflater.inflate(R.layout.folder_list, container, false);
	}

	@Override
	public void onListItemClick(ListView l, View v, int position, long id) {
		CollaborativeMap clickItem = (CollaborativeMap) v.getTag();

		CollaborativeList list = (CollaborativeList) clickItem.get(FOLDER_KEY);
		if (null != list && 0 == list.length()) {

			Toast.makeText(DataListFragment.this.getActivity(), "该文件夹为空文件夹!",
					Toast.LENGTH_SHORT).show();

		} else {
			historyOpenedFolders.push(clickItem);
		}
	}

	private void setListListener(CollaborativeList listenerList) {
		listenerList.addValuesSetListener(valuesSetEventHandler);

		listenerList.addValuesRemovedListener(valuesRemovedEventHandler);

		listenerList.addValuesAddedListener(valuesAddedEventHandler);
	}

	private void removeListListener(CollaborativeList listenerList) {
		listenerList.removeEventListener(EventType.VALUES_SET,
				valuesSetEventHandler, false);

		listenerList.removeEventListener(EventType.VALUES_REMOVED,
				valuesRemovedEventHandler, false);

		listenerList.removeEventListener(EventType.VALUES_ADDED,
				valuesAddedEventHandler, false);
	}

	public void setMapListener(CollaborativeMap listenerMap) {
		listenerMap.addValueChangedListener(valuesChangeEventHandler);
	}

	public void removeMapListener(CollaborativeMap listenerMap) {
		listenerMap.removeEventListener(EventType.VALUE_CHANGED,
				valuesChangeEventHandler, false);
	}
}
