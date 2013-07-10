package com.goodow.drive.android.fragment;

import com.goodow.drive.android.R;
import com.goodow.drive.android.adapter.MyArrayAdapter;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
import com.goodow.realtime.CollaborativeList;
import com.goodow.realtime.CollaborativeMap;
import com.goodow.realtime.Document;
import com.goodow.realtime.DocumentLoadedHandler;
import com.goodow.realtime.EventHandler;
import com.goodow.realtime.Model;
import com.goodow.realtime.ModelInitializerHandler;
import com.goodow.realtime.Realtime;
import com.goodow.realtime.ValueChangedEvent;
import com.goodow.realtime.ValuesAddedEvent;
import com.goodow.realtime.ValuesRemovedEvent;
import com.goodow.realtime.ValuesSetEvent;

import java.util.ArrayList;
import java.util.Map;

import elemental.js.util.StringUtil;

import android.R.integer;

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

  private ArrayList<String> dataSourceOfFolderList = new ArrayList<String>();
  private MyArrayAdapter adapter;

  private Document doc;
  private Model model;
  private CollaborativeMap root;
  public static final String DATA_KEY = "folders";

  private ArrayList<Integer> canOpen = new ArrayList<Integer>();// 标注哪些是文件夹,可以点击进入
  private Object[] dataValues;
  private String[] folderPath;

  public void backFragment() {
    if (null != folderPath && 0 < folderPath.length) {
      if (1 == folderPath.length) {
        folderPath = null;
      } else {
        String[] frontFolderPath = new String[folderPath.length - 1];
        for (int i = 0; i < folderPath.length - 1; i++) {
          frontFolderPath[i] = folderPath[i];
        }
        folderPath = frontFolderPath;
      }

      showData(dataValues);

    } else {
      Toast.makeText(getActivity(), R.string.backFolderErro, Toast.LENGTH_SHORT).show();
    }
  }

  public void connectString() {
    final CollaborativeList list = root.get(DATA_KEY);
    dataValues = list.asArray();

    showData(dataValues);

    list.addValuesSetListener(new EventHandler<ValuesSetEvent>() {
      @Override
      public void handleEvent(ValuesSetEvent arg0) {
        dataValues = list.asArray();

        if (null != dataValues && dataValues.length != 0) {
          showData(dataValues);
        }
      }
    });

    list.addValuesRemovedListener(new EventHandler<ValuesRemovedEvent>() {
      @Override
      public void handleEvent(ValuesRemovedEvent arg0) {
        dataValues = list.asArray();

        if (null != dataValues && dataValues.length != 0) {
          showData(dataValues);
        }
      }

    });

    list.addValuesAddedListener(new EventHandler<ValuesAddedEvent>() {
      @Override
      public void handleEvent(ValuesAddedEvent event) {
        dataValues = list.asArray();

        if (null != dataValues && dataValues.length != 0) {
          showData(dataValues);
        }
      }
    });
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    adapter = new MyArrayAdapter(getActivity(), R.layout.row_folderlist, 0, dataSourceOfFolderList);
    setListAdapter(adapter);

  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    return inflater.inflate(R.layout.folder_list, container, false);
  }

  @Override
  public void onListItemClick(ListView l, View v, int position, long id) {
    for (Integer item : canOpen) {
      if (item == position) {

        String[] nextFolderPaht = null;

        if (null == folderPath) {
          nextFolderPaht = new String[1];
        } else {
          nextFolderPaht = new String[folderPath.length + 1];
          for (int i = 0; i < folderPath.length; i++) {
            nextFolderPaht[i] = folderPath[i];
          }
        }
        nextFolderPaht[nextFolderPaht.length - 1] = Integer.toString(position);

        folderPath = nextFolderPaht;

        showData(dataValues);
        break;
        // addFragment(nextFolderPaht);
      }
    }
  }

  @Override
  public void onResume() {
    super.onResume();

    backButton = (Button) getActivity().findViewById(R.id.backButton);
    backButton.setOnClickListener(new OnClickListener() {
      @Override
      public void onClick(View v) {
        backFragment();
      }
    });

    Realtime.load("@tmp/" + GlobalDataCacheForMemorySingleton.getInstance().getUserId() + "/androidTest02", new DocumentLoadedHandler() {
      @Override
      public void onLoaded(Document document) {
        doc = document;
        model = doc.getModel();
        root = model.getRoot();

        connectString();

      }
    }, new ModelInitializerHandler() {
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
              CollaborativeList subList = model.createList(null);

              if ("folderschild".equals(mapKey[i])) {
                CollaborativeMap subMap = model.createMap(null);
                subMap.set("label", "SubFolder");
                subMap.set("filechild", model.createList(null));
                subMap.set("folderschild", model.createList(null));
                subList.push(subMap);
              }

              map.set(mapKey[i], subList);
            }

          }

          values[k] = map;
        }

        CollaborativeList list = model_.createList(null);
        list.pushAll(values);

        root.set("folders", list);
        System.out.println();
      }
    }, null);
  }

  public void showData(Object[] values) {
    dataSourceOfFolderList.clear();
    canOpen.clear();

    if (null != folderPath) {
      CollaborativeMap folder = null;

      for (int i = 0; i < folderPath.length; i++) {
        folder = (CollaborativeMap) values[Integer.parseInt(folderPath[i])];
        values = ((CollaborativeList) folder.get("folderschild")).asArray();
      }

      CollaborativeList childFolderList = ((CollaborativeList) folder.get("folderschild"));

      childFolderList.addValuesSetListener(new EventHandler<ValuesSetEvent>() {
        @Override
        public void handleEvent(ValuesSetEvent arg0) {
          dataValues = ((CollaborativeList) root.get(DATA_KEY)).asArray();

          if (null != dataValues && dataValues.length != 0) {
            showData(dataValues);
          }
        }
      });

      childFolderList.addValuesRemovedListener(new EventHandler<ValuesRemovedEvent>() {
        @Override
        public void handleEvent(ValuesRemovedEvent arg0) {
          dataValues = ((CollaborativeList) root.get(DATA_KEY)).asArray();

          if (null != dataValues && dataValues.length != 0) {
            showData(dataValues);
          }
        }

      });

      childFolderList.addValuesAddedListener(new EventHandler<ValuesAddedEvent>() {
        @Override
        public void handleEvent(ValuesAddedEvent event) {
          dataValues = ((CollaborativeList) root.get(DATA_KEY)).asArray();

          if (null != dataValues && dataValues.length != 0) {
            showData(dataValues);
          }
        }
      });

      Object[] folders = childFolderList.asArray();

      for (int i = 0; i < folders.length; i++) {
        final CollaborativeMap folderItem = (CollaborativeMap) folders[i];

        // map监听修改事件
        folderItem.addValueChangedListener(new EventHandler<ValueChangedEvent>() {
          @Override
          public void handleEvent(ValueChangedEvent event) {
            String key = event.getProperty();
            Object newValue = event.getNewValue();

            if (null != key) {
              if (key.equals("label")) {
                folderItem.set("label", newValue);

                showData(dataValues);
              }
            }

          }
        });

        String folderName = (String) folderItem.get("label");
        CollaborativeList folderItem_folders = (CollaborativeList) folderItem.get("folderschild");
        CollaborativeList folderItem_files = (CollaborativeList) folderItem.get("filechild");

        dataSourceOfFolderList.add(folderName);
        if ((null != folderItem_folders && folderItem_folders.length() != 0)
            || (null != folderItem_files && folderItem_files.length() != 0)) {
          canOpen.add(i);
        }
      }

      // TODO
      CollaborativeList childFileList = ((CollaborativeList) folder.get("filechild"));
      Object[] files = childFileList.asArray();

      for (int i = 0; i < files.length; i++) {

      }
    } else {
      for (int i = 0; i < values.length; i++) {
        final CollaborativeMap folderItem = (CollaborativeMap) values[i];

        folderItem.addValueChangedListener(new EventHandler<ValueChangedEvent>() {
          @Override
          public void handleEvent(ValueChangedEvent event) {
            String key = event.getProperty();
            Object newValue = event.getNewValue();

            if (null != key) {
              if (key.equals("label")) {
                folderItem.set("label", newValue);

                showData(dataValues);
              }
            }
          }
        });

        String folderName = (String) folderItem.get("label");
        CollaborativeList folderItem_folders = (CollaborativeList) folderItem.get("folderschild");
        CollaborativeList folderItem_files = (CollaborativeList) folderItem.get("filechild");

        dataSourceOfFolderList.add(folderName);
        if ((null != folderItem_folders && folderItem_folders.length() != 0)
            || (null != folderItem_files && folderItem_files.length() != 0)) {
          canOpen.add(i);
        }
      }
    }

    adapter.notifyDataSetChanged();
  }
}
