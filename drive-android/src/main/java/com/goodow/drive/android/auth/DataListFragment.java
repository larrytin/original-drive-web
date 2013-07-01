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

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.FragmentTransaction;
import android.app.ListFragment;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

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
  private ArrayList<Integer> canOpen = new ArrayList<Integer>();// 标注哪些是文件夹,可以点击进入
  private Object[] dataValues;

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
    dataValues = list.asArray();

    adapter = new MyArrayAdapter(getActivity(), R.layout.row_datalist, 0, DATALIST);
    setListAdapter(adapter);

    // 应对事件嵌套,故将数据展现代码单独提出
    if (null != folderPaht && 0 != folderPaht.length) {
      showData(list.asArray());
      adapter.notifyDataSetChanged();
    }

    list.addValuesAddedListener(new EventHandler<ValuesAddedEvent>() {
      @Override
      public void handleEvent(ValuesAddedEvent event) {
        dataValues = event.getValues();

        if (null != dataValues && dataValues.length != 0) {
          if (null != folderPaht && 0 != folderPaht.length) {
            showData(dataValues);

          } else {
            /**
             * 默认第一次资源浏览
             */

            for (int i = 0; i < dataValues.length; i++) {
              Object object = dataValues[i];
              if (object instanceof String) {
                DATALIST.add((String) object + "\n创建时间:" + DATEFORMAT.format(new Date()));
              } else if (object instanceof CollaborativeList) {
                DATALIST.add(((CollaborativeList) object).get(0).toString() + "\n创建时间:" + DATEFORMAT.format(new Date()));

                if (((CollaborativeList) object).length() >= 2) {
                  canOpen.add(i);
                }

              }
            }

            adapter.notifyDataSetChanged();
          }
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

    Realtime.load("@tmp/b5", new DocumentLoadedHandler() {
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

        CollaborativeList rootlist;
        CollaborativeList leaflist;

        CollaborativeList folders = model.createList();

        String[] name = { "课件-joker", "文学-joker", "视频-joker" };

        for (String i : name) {
          rootlist = model.createList();
          folders.push(rootlist);
        }

        for (int i = 0; i < name.length; i++) {
          leaflist = model.createList();
          leaflist.push(name[i] + "a");
          leaflist.push(name[i] + "b");
          leaflist.push(name[i] + "c");
          leaflist.push(name[i] + "d");

          ((CollaborativeList) folders.get(i)).push(name[i]);
          ((CollaborativeList) folders.get(i)).push(leaflist);
        }

        root.set("folders", folders);
      }
    }, null);
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    return inflater.inflate(R.layout.fragment_datalist, container, false);
  }

  @Override
  public void onListItemClick(ListView l, View v, int position, long id) {
    for (Integer item : canOpen) {
      if (item == position) {

        String[] nextFolderPaht = null;

        if (null == folderPaht) {
          nextFolderPaht = new String[1];
        } else {
          nextFolderPaht = new String[folderPaht.length + 1];
          for (int i = 0; i < folderPaht.length; i++) {
            nextFolderPaht[i] = folderPaht[i];
          }
        }
        nextFolderPaht[nextFolderPaht.length - 1] = Integer.toString(position);

        folderPaht = nextFolderPaht;

        showData(dataValues);
        break;
        // addFragment(nextFolderPaht);
      }
    }

  }

  public void showData(Object[] values) {
    DATALIST.clear();
    canOpen.clear();

    for (int i = 0; i < folderPaht.length; i++) {
      CollaborativeList path = (CollaborativeList) values[Integer.parseInt(folderPaht[i])];
      values = ((CollaborativeList) path.asArray()[1]).asArray();
    }

    for (int i = 0; i < values.length; i++) {
      Object item = values[i];

      if (item instanceof String) {
        DATALIST.add((String) item + "\n创建时间:" + DATEFORMAT.format(new Date()));
      } else if (item instanceof CollaborativeList) {
        DATALIST.add(((CollaborativeList) item).get(0).toString() + "\n创建时间:" + DATEFORMAT.format(new Date()));

        if (((CollaborativeList) item).length() >= 2) {
          canOpen.add(i);
        }
      }
    }

    adapter.notifyDataSetChanged();
  }

}
