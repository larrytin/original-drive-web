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

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.FragmentTransaction;
import android.app.ListFragment;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

@SuppressLint("ValidFragment")
public class DataListFragment extends ListFragment {
  @SuppressLint("SimpleDateFormat")
  public final static SimpleDateFormat DATEFORMAT = new SimpleDateFormat("yyyy-MM-dd");
  private ArrayList<String> DATALIST = new ArrayList<String>();
  private MyArrayAdapter adapter;

  private Document doc;
  private Model model;
  private CollaborativeMap root;
  public static final String DATA_KEY = "folders";

  private String[] folderPaht;
  private FragmentTransaction ft;

  public DataListFragment() {
    super();
  }

  public DataListFragment(String[] folderPaht) {
    super();
    this.folderPaht = folderPaht;
  }

  @SuppressLint("CommitTransaction")
  public void addFragment(String[] path) {
    ft = this.getActivity().getFragmentManager().beginTransaction();
    DataListFragment df = new DataListFragment(path);
    ft.replace(android.R.id.content, df);

    ft.addToBackStack(null);
    ft.commit();
  }

  public void connectString() {
    CollaborativeList list = root.get(DATA_KEY);

    adapter = new MyArrayAdapter(getActivity(), R.layout.row_datalist, 0, DATALIST);
    setListAdapter(adapter);

    list.addValuesAddedListener(new EventHandler<ValuesAddedEvent>() {
      @Override
      public void handleEvent(ValuesAddedEvent event) {
        Object[] values = event.getValues();

        if (null != values && values.length != 0) {
          if (null != folderPaht && 0 != folderPaht.length) {
            /**
             * 给定路径资源浏览
             */

            CollaborativeList path = (CollaborativeList) values[Integer.parseInt(folderPaht[0])];
            // 从第2个元素迭代,第1个已经赋值给path
            for (int i = 1; i < folderPaht.length; i++) {
              path = path.get(i);
            }

            // 从第2个元素迭代子目录名,第1个是本CollaborativeList的名字
            for (int i = 1; i < path.length(); i++) {
              CollaborativeList item = path.get(i);
              DATALIST.add(item.get(0).toString());
            }
          } else {
            /**
             * 默认路径资源浏览
             */

            for (int i = 0; i < values.length; i++) {
              Object object = values[i];
              if (object instanceof String) {
                DATALIST.add((String) object + "\n创建时间:" + DATEFORMAT.format(new Date()));
              } else if (object instanceof CollaborativeList) {
                DATALIST.add(((CollaborativeList) object).get(0).toString() + "\n创建时间:" + DATEFORMAT.format(new Date()));
              }
            }
          }

          adapter.notifyDataSetChanged();
        }
      }
    });
  }

  public void intentManager(Class<? extends Activity> activityClass, int[] folderPath) {
    Intent i = new Intent(this.getActivity(), activityClass);
    i.putExtra("folderPath", folderPath);
    startActivity(i);
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    if (null != folderPaht && 0 != folderPaht.length) {
      if (folderPaht[0].equals("0")) {
        DATALIST.add("文件1");
        DATALIST.add("文件2");
      } else if (folderPaht[0].equals("1")) {
        DATALIST.add("文件a");
        DATALIST.add("文件b");
      }

      adapter = new MyArrayAdapter(getActivity(), R.layout.row_datalist, 0, DATALIST);
      setListAdapter(adapter);
    } else {
      DATALIST.add("课件123");
      DATALIST.add("课件abc");
      adapter = new MyArrayAdapter(getActivity(), R.layout.row_datalist, 0, DATALIST);
      setListAdapter(adapter);
    }

    // Realtime.authorize("472594435436922982213", "a9bdca9134ea77de58b8cb9eca04b0b56c79284d");
    // Realtime.load("@tmp/myFoldersJOKER3", new DocumentLoadedHandler() {
    // @Override
    // public void onLoaded(Document document) {
    // doc = document;
    // model = doc.getModel();
    // root = model.getRoot();
    //
    // connectString();
    //
    // }
    // }, new ModelInitializerHandler() {
    // @Override
    // public void onInitializer(Model model_) {
    // model = model_;
    // root = model.getRoot();
    //
    // CollaborativeList rootlist;
    // CollaborativeList leaflist;
    //
    // CollaborativeList folders = model.createList();
    //
    // String[] name = { "课件-joker", "文学-joker", "视频-joker" };
    //
    // for (String i : name) {
    // rootlist = model.createList();
    // folders.push(rootlist);
    // }
    //
    // for (int i = 0; i < name.length; i++) {
    // leaflist = model.createList();
    // leaflist.push(name[i] + "a");
    // leaflist.push(name[i] + "b");
    // leaflist.push(name[i] + "c");
    // leaflist.push(name[i] + "d");
    //
    // ((CollaborativeList) folders.get(i)).push(name[i]);
    // ((CollaborativeList) folders.get(i)).push(leaflist);
    // }
    //
    // root.set("folders", folders);
    // }
    // }, null);
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    return inflater.inflate(R.layout.fragment_datalist, container, false);
  }

  // @Override
  // public void onListItemClick(ListView l, View v, int position, long id) {
  // String[] nextFolderPaht = null;
  //
  // if (null == folderPaht) {
  // nextFolderPaht = new String[1];
  // } else {
  // nextFolderPaht = new String[folderPaht.length + 1];
  // for (int i = 0; i < folderPaht.length; i++) {
  // nextFolderPaht[i] = folderPaht[i];
  // }
  // }
  // nextFolderPaht[nextFolderPaht.length - 1] = Integer.toString(position);
  //
  // addFragment(nextFolderPaht);
  // }
}
