package com.goodow.drive.android.auth;

import com.goodow.drive.android.R;
import com.goodow.drive.android.adapter.MyArrayAdapter;
import com.goodow.realtime.CollaborativeList;
import com.goodow.realtime.CollaborativeMap;
import com.goodow.realtime.Document;
import com.goodow.realtime.DocumentLoadedHandler;
import com.goodow.realtime.EventHandler;
import com.goodow.realtime.Model;
import com.goodow.realtime.ModelInitializerHandler;
import com.goodow.realtime.Realtime;
import com.goodow.realtime.ValuesAddedEvent;

import java.util.ArrayList;

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
  private String authorize;

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
    CollaborativeList list = root.get(DATA_KEY);
    dataValues = list.asArray();

    // 应对事件嵌套,故将数据展现代码单独提出
    showData(list.asArray());

    list.addValuesAddedListener(new EventHandler<ValuesAddedEvent>() {
      @Override
      public void handleEvent(ValuesAddedEvent event) {
        dataValues = event.getValues();

        if (null != dataValues && dataValues.length != 0) {
          showData(dataValues);
        }
      }
    });
  }

  public void deleteFolder(View v) {

    Toast.makeText(getActivity(), "金正恩真可怜！---" + v.getTag(), Toast.LENGTH_SHORT).show();
  }

  /**
   * @return the authorize
   */
  public String getAuthorize() {
    return authorize;
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

    adapter = new MyArrayAdapter(getActivity(), R.layout.row_datalist, 0, dataSourceOfFolderList);
    setListAdapter(adapter);

    Realtime.load("@tmp/b10", new DocumentLoadedHandler() {
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

      }
    }, null);
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

  /**
   * @param authorize the authorize to set
   */
  public void setAuthorize(String authorize) {
    this.authorize = authorize;
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

      Object[] folders = ((CollaborativeList) folder.get("folderschild")).asArray();
      Object[] files = ((CollaborativeList) folder.get("filechild")).asArray();

      for (int i = 0; i < folders.length; i++) {
        CollaborativeMap folderItem = (CollaborativeMap) folders[i];

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
      for (int i = 0; i < files.length; i++) {

      }
    } else {
      for (int i = 0; i < values.length; i++) {
        CollaborativeMap folderItem = (CollaborativeMap) values[i];

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
