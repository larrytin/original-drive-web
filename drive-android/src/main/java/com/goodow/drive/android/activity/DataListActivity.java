package com.goodow.drive.android.activity;

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

import android.app.ActionBar;
import android.app.Activity;
import android.app.FragmentTransaction;
import android.app.ListActivity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.PopupWindow;
import android.widget.TextView;
import android.widget.Toast;

public class DataListActivity extends ListActivity {
  private PopupWindow popw;
  private TextView textView;
  private String authorize;

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

  // private FragmentTransaction ft;

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

    Toast.makeText(this, "金正恩真可怜！---" + v.getTag(), Toast.LENGTH_SHORT).show();
  }

  /**
   * @return the authorize
   */
  public String getAuthorize() {
    return authorize;
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.folder_list);

    // textView = (TextView) findViewById(R.id.showPop);
    ActionBar aBar = getActionBar();
    aBar.setDisplayHomeAsUpEnabled(true);// 使action bar可以被点击

    adapter = new MyArrayAdapter(this, R.layout.row_folderlist, 0, DATALIST);
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
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (keyCode == KeyEvent.KEYCODE_BACK) {
      if (null != folderPaht && 0 < folderPaht.length) {
        if (1 == folderPaht.length) {
          folderPaht = null;
        } else {
          String[] frontFolderPath = new String[folderPaht.length - 1];
          for (int i = 0; i < folderPaht.length - 1; i++) {
            frontFolderPath[i] = folderPaht[i];
          }
          folderPaht = frontFolderPath;
        }

        showData(dataValues);

        return true;
      }
    }

    return super.onKeyDown(keyCode, event);
  }

  /**
   * @param authorize the authorize to set
   */
  public void setAuthorize(String authorize) {
    this.authorize = authorize;
  }

  public void showData(Object[] values) {
    DATALIST.clear();
    canOpen.clear();

    if (null != folderPaht) {
      CollaborativeMap folder = null;

      for (int i = 0; i < folderPaht.length; i++) {
        folder = (CollaborativeMap) values[Integer.parseInt(folderPaht[i])];
        values = ((CollaborativeList) folder.get("folderschild")).asArray();
      }

      Object[] folders = ((CollaborativeList) folder.get("folderschild")).asArray();
      Object[] files = ((CollaborativeList) folder.get("filechild")).asArray();

      for (int i = 0; i < folders.length; i++) {
        CollaborativeMap folderItem = (CollaborativeMap) folders[i];

        String folderName = (String) folderItem.get("label");
        CollaborativeList folderItem_folders = (CollaborativeList) folderItem.get("folderschild");
        CollaborativeList folderItem_files = (CollaborativeList) folderItem.get("filechild");

        DATALIST.add(folderName);
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

        DATALIST.add(folderName);
        if ((null != folderItem_folders && folderItem_folders.length() != 0)
            || (null != folderItem_files && folderItem_files.length() != 0)) {
          canOpen.add(i);
        }
      }
    }

    adapter.notifyDataSetChanged();
  }

  @Override
  protected void onListItemClick(ListView l, View v, int position, long id) {
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
}