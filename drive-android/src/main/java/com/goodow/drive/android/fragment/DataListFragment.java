package com.goodow.drive.android.fragment;

import com.goodow.drive.android.R;
import com.goodow.drive.android.adapter.CollaborativeAdapter;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
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
import com.goodow.realtime.ValuesSetEvent;
import java.util.ArrayList;
import java.util.List;
import android.app.ListFragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

public class DataListFragment extends ListFragment {
  private Button backButton;

  private List<CollaborativeMap> historyOpenedFolders = new ArrayList<CollaborativeMap>();
  private CollaborativeMap currentFolder = null;

  private CollaborativeAdapter adapter;

  private Document doc;
  private Model model;
  private CollaborativeMap root;
  private CollaborativeList list;
  private static final String DATA_KEY = "folders";
  private EventHandler<ValuesAddedEvent> valuesAddedEventHandler;
  private EventHandler<ValuesRemovedEvent> valuesRemovedEventHandler;
  private EventHandler<ValuesSetEvent> valuesSetEventHandler;

  private ArrayList<Integer> canOpen = new ArrayList<Integer>();// 标注哪些是文件夹,可以点击进入

  public void addCanOpenItem(Integer position) {
    canOpen.add(position);
  }

  public void backFragment() {
    if (null != currentFolder) {
      currentFolder = historyOpenedFolders.get(historyOpenedFolders.size() - 1);
      historyOpenedFolders.remove(historyOpenedFolders.size() - 1);

      if (0 != historyOpenedFolders.size()) {
        initData();
      } else {
        adapter.setFolderList(list);
        freshListData();
      }

    } else {
      Toast.makeText(getActivity(), R.string.backFolderErro, Toast.LENGTH_SHORT).show();
    }
  }

  public void connectUi() {
    list = root.get(DATA_KEY);

    adapter.setFolderList(list);

    setListListener(list);
  }

  public void freshListData() {
    canOpen.clear();
    adapter.notifyDataSetChanged();
  }

  public void initData() {
    if (null != currentFolder) {
      CollaborativeList folderList = (CollaborativeList) currentFolder.get("folderschild");
      CollaborativeList fileList = (CollaborativeList) currentFolder.get("filechild");

      adapter.setFolderList(folderList);
      adapter.setFileList(fileList);
      freshListData();

      setListListener(folderList);
      setListListener(fileList);
    }
  }

  @Override
  public void onActivityCreated(Bundle savedInstanceState) {
    super.onActivityCreated(savedInstanceState);

    backButton = (Button) getActivity().findViewById(R.id.backButton);
    backButton.setOnClickListener(new OnClickListener() {
      @Override
      public void onClick(View v) {
        backFragment();
      }
    });
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    adapter = new CollaborativeAdapter(this, this.getActivity(), null, null);
    setListAdapter(adapter);

    valuesAddedEventHandler = new EventHandler<ValuesAddedEvent>() {
      @Override
      public void handleEvent(ValuesAddedEvent event) {
        freshListData();
      }
    };

    valuesRemovedEventHandler = new EventHandler<ValuesRemovedEvent>() {
      @Override
      public void handleEvent(ValuesRemovedEvent event) {
        freshListData();
      }
    };

    valuesSetEventHandler = new EventHandler<ValuesSetEvent>() {
      @Override
      public void handleEvent(ValuesSetEvent event) {
        freshListData();
      }
    };

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
      }
    };

    String docId = "@tmp/" + GlobalDataCacheForMemorySingleton.getInstance().getUserId() + "/androidTest02";
    Realtime.load(docId, onLoaded, initializer, null);
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    return inflater.inflate(R.layout.folder_list, container, false);
  }

  @Override
  public void onListItemClick(ListView l, View v, int position, long id) {
    if (canOpen.contains(position)) {
      CollaborativeMap clickItem = (CollaborativeMap) v.getTag();
      historyOpenedFolders.add(currentFolder);
      currentFolder = clickItem;

      initData();
    }
  }

  private void setListListener(CollaborativeList listenerList) {
    listenerList.addValuesSetListener(valuesSetEventHandler);

    listenerList.addValuesRemovedListener(valuesRemovedEventHandler);

    listenerList.addValuesAddedListener(valuesAddedEventHandler);
  }
}
