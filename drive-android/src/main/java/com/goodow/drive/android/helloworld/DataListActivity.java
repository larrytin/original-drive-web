package com.goodow.drive.android.helloworld;

import com.goodow.drive.android.R;
import com.goodow.drive.android.auth.DataListFragment;

import android.app.FragmentTransaction;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
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

public class DataListActivity extends Activity {
  private PopupWindow popw;
  private TextView textView;

  public void deleteFolder(View v) {

    Toast.makeText(this, "金正恩真可怜！---" + v.getTag(), Toast.LENGTH_SHORT).show();
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    FragmentTransaction ft = this.getFragmentManager().beginTransaction();
    DataListFragment df = new DataListFragment();
    ft.replace(android.R.id.content, df);

    ft.addToBackStack(null);
    ft.commit();

    String authorize = this.getIntent().getStringExtra("authorize");

    textView = (TextView) findViewById(R.id.showPop);

    ActionBar aBar = getActionBar();
    // aBar.setDisplayHomeAsUpEnabled(true);// 使action bar可以被点击

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
}
