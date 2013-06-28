package com.goodow.drive.android.helloworld;

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
  private ListView listView;

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
    setContentView(R.layout.activity_datalist);

    textView = (TextView) findViewById(R.id.showPop);
    ActionBar aBar = getActionBar();
    aBar.setDisplayHomeAsUpEnabled(true);// 使action bar可以被点击

    listView = getListView();
    adapter = new MyArrayAdapter(this, R.layout.row_datalist, 0, DATALIST);
    listView.setAdapter(adapter);

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

    // FragmentTransaction ft = this.getFragmentManager().beginTransaction();
    // DataListFragment df = new DataListFragment();
    // ft.replace(android.R.id.content, df);
    //
    // ft.addToBackStack(null);
    // ft.commit();

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

  @Override
  public boolean onOptionsItemSelected(MenuItem item) {
    super.onOptionsItemSelected(item);

    if (item.getItemId() == android.R.id.home) {
      if (null != popw) {
        popw.dismiss();
      } else {
        View popupWindow_view = getLayoutInflater().inflate(R.layout.popup_list, null, false);

        popw = new PopupWindow(popupWindow_view, 200, 220, true);

        ListView listView = (ListView) popupWindow_view.findViewById(R.id.pop_list);
        String[] menus = { "我的课件", "我的下载", "未知性选项（慎入）" };
        listView.setAdapter(new ArrayAdapter<String>(this, R.layout.popup_list_item, menus) {
          @Override
          public View getView(int position, View convertView, ViewGroup parent) {
            View row = convertView;
            if (null == row) {
              row = ((Activity) this.getContext()).getLayoutInflater().inflate(R.layout.popup_list_item, parent, false);
            }

            TextView textView = (TextView) row.findViewById(R.id.pop_list_item);
            textView.setText(getItem(position));

            return row;
          }
        });

        // 点击其他地方消失
        popupWindow_view.setOnTouchListener(new OnTouchListener() {
          @Override
          public boolean onTouch(View v, MotionEvent event) {
            if (popw != null && popw.isShowing()) {
              popw.dismiss();
              popw = null;
            }
            return false;
          }
        });
      }

      popw.showAsDropDown(textView);

    }

    return true;
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
      for (int i = 0; i < folderPaht.length; i++) {
        CollaborativeList path = (CollaborativeList) values[Integer.parseInt(folderPaht[i])];
        values = ((CollaborativeList) path.asArray()[1]).asArray();
      }
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
