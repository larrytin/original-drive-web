package com.goodow.drive.android.adapter;

import com.goodow.drive.android.R;
import com.goodow.drive.android.fragment.DataListFragment;
import com.goodow.realtime.CollaborativeList;
import com.goodow.realtime.CollaborativeMap;
import com.goodow.realtime.EventHandler;
import com.goodow.realtime.ValueChangedEvent;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

public class CollaborativeAdapter extends BaseAdapter {
  private CollaborativeList folderList;
  private CollaborativeList fileList;
  private LayoutInflater layoutInflater;
  private DataListFragment fragment;

  public CollaborativeAdapter(DataListFragment fragment, Context context, CollaborativeList folderList, CollaborativeList fileList) {
    super();
    this.fragment = fragment;
    this.folderList = folderList;
    this.fileList = fileList;
    this.layoutInflater = LayoutInflater.from(context);
  }

  @Override
  public int getCount() {
    int count = 0;

    do {
      if (null == folderList && null == fileList) {
        break;
      }

      if ((null == fileList || fileList.length() == 0) && null != folderList && folderList.length() != 0) {
        count = folderList.length() + 1;
        break;
      }

      if ((null == folderList || folderList.length() == 0) && null != fileList && fileList.length() != 0) {
        count = fileList.length() + 1;
        break;
      }

      if (folderList.length() != 0 && fileList.length() != 0) {
        count = folderList.length() + fileList.length() + 2;
        break;
      }

    } while (false);

    return count;
  }

  @Override
  public Object getItem(int position) {
    Object object = null;
    do {
      if (null == folderList) {
        break;
      }

      if (position == 0) {
        break;// 分组标题-文件夹
      }

      position = position - 1;

      if (null != folderList && position < folderList.length()) {
        object = folderList.get(position);// 子元素-文件夹
        break;
      }

      if (position == folderList.length()) {
        break;// 分组标题-文件
      }

      if (null != fileList) {
        object = fileList.get(position - 1 - folderList.length());// 子元素-文件
        break;
      }

    } while (false);

    return object;
  }

  @Override
  public long getItemId(int position) {
    return position;
  }

  @Override
  public View getView(int position, View convertView, ViewGroup parent) {
    final CollaborativeMap item = (CollaborativeMap) getItem(position);
    String textViewContentString = "";
    View row = convertView;

    if (0 == position) {
      row = layoutInflater.inflate(R.layout.row_foldergroup, parent, false);
      textViewContentString = "文件夹";
    } else if (0 != position && null == item) {
      row = layoutInflater.inflate(R.layout.row_foldergroup, parent, false);
      textViewContentString = "文件";
    } else {

      row = layoutInflater.inflate(R.layout.row_folderlist, parent, false);

      row.setTag(item);

      ImageView img_left = (ImageView) row.findViewById(R.id.leftImage);
      img_left.setImageResource(R.drawable.ic_type_folder);

      textViewContentString = (String) item.get("label");

      CollaborativeList folderList = (CollaborativeList) item.get("folderschild");
      CollaborativeList fileList = (CollaborativeList) item.get("filechild");
      if ((null != folderList && 0 != folderList.length()) || (null != fileList && 0 != fileList.length())) {
        fragment.addCanOpenItem(position);
      }

      item.addValueChangedListener(new EventHandler<ValueChangedEvent>() {
        @Override
        public void handleEvent(ValueChangedEvent event) {
          String eventProperty = event.getProperty();
          if (eventProperty.equals("label")) {
            item.set("label", event.getNewValue());
          }

          fragment.freshListData();
        }
      });
    }

    TextView listItem = (TextView) row.findViewById(R.id.listItem);
    listItem.setText(textViewContentString);

    return row;
  }

  @Override
  public boolean isEnabled(int position) {
    if (null == getItem(position)) {
      return false;
    }

    return super.isEnabled(position);
  }

  /**
   * @param fileList the fileList to set
   */
  public void setFileList(CollaborativeList fileList) {
    this.fileList = fileList;
  }

  /**
   * @param folderList the folderList to set
   */
  public void setFolderList(CollaborativeList folderList) {
    this.folderList = folderList;
  }

}
