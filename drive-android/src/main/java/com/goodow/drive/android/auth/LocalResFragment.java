package com.goodow.drive.android.auth;

import com.goodow.drive.android.R;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
import com.goodow.drive.android.toolutils.ToolsFunctionForThisProgect;

import java.io.File;
import java.util.ArrayList;

import android.widget.Toast;

import android.view.View.OnClickListener;
import android.widget.Button;

import android.widget.ListView;

import android.R.integer;

import android.widget.ImageView;
import android.widget.TextView;

import android.app.Activity;

import android.widget.BaseAdapter;

import android.widget.BaseAdapter;

import android.database.DataSetObserver;

import android.widget.ListAdapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.os.Bundle;
import android.app.ListFragment;

public class LocalResFragment extends ListFragment {
  // 保存文件路径
  private ArrayList<String> folderPathList = new ArrayList<String>();
  // 保存文件名
  private ArrayList<String> folderNameList;
  // 保存当前级文件的父文件路径
  private String parentDirectory = null;

  private Button backButton;

  @Override
  public void onActivityCreated(Bundle savedInstanceState) {
    super.onActivityCreated(savedInstanceState);

    backButton = (Button) getActivity().findViewById(R.id.backButton);
    backButton.setOnClickListener(new OnClickListener() {
      @Override
      public void onClick(View v) {
        if (null != parentDirectory) {
          folderNameList = getDataSourceWithDirPath(parentDirectory);
          ((BaseAdapter) getListAdapter()).notifyDataSetChanged();

          parentDirectory = new File(parentDirectory).getParentFile().getAbsolutePath();

          // 如果返回至用户文件夹,则置空父文件路径
          File userFolderFile = new File(GlobalDataCacheForMemorySingleton.getInstance().getUserResDirPath());
          if (parentDirectory.equals(userFolderFile.getParentFile().getAbsolutePath())) {
            parentDirectory = null;
          }

        } else {
          Toast.makeText(getActivity(), R.string.backFolderErro, Toast.LENGTH_SHORT).show();
        }
      }
    });

    folderNameList = getDataSourceWithDirPath(GlobalDataCacheForMemorySingleton.getInstance.getUserResDirPath());

    setListAdapter(new BaseAdapter() {

      @Override
      public int getCount() {
        if (folderNameList != null) {
          return folderNameList.size();
        } else {
          return 0;
        }
      }

      @Override
      public Object getItem(int position) {
        // TODO Auto-generated method stub
        return null;
      }

      @Override
      public long getItemId(int position) {
        // TODO Auto-generated method stub
        return 0;
      }

      @Override
      public View getView(int position, View convertView, ViewGroup parent) {
        View row = convertView;
        if (null == row) {
          row = LocalResFragment.this.getActivity().getLayoutInflater().inflate(R.layout.row_folderlist, parent, false);
        }

        ImageView img_left = (ImageView) row.findViewById(R.id.leftImage);
        TextView listItem = (TextView) row.findViewById(R.id.listItem);
        String item = folderNameList.get(position);

        int index = item.lastIndexOf(".");
        if (index > 0) {
          listItem.setText(item.substring(0, index));
        } else {
          listItem.setText(item);
        }

        img_left.setImageResource(ToolsFunctionForThisProgect.getFileIconByFileFullName(item));

        return row;
      }
    });
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    return inflater.inflate(R.layout.folder_list, container, false);
  }

  @Override
  public void onListItemClick(ListView l, View v, int position, long id) {
    File file = new File(folderPathList.get(position));

    if (file.isDirectory()) {
      parentDirectory = file.getParentFile().getAbsolutePath();
      folderNameList = getDataSourceWithDirPath(folderPathList.get(position));
      ((BaseAdapter) getListAdapter()).notifyDataSetChanged();
    }
  }

  private ArrayList<String> getDataSourceWithDirPath(final String dirPath) {
    ArrayList<String> dataSource = new ArrayList<String>();

    File dir = new File(dirPath);

    folderPathList.clear();

    for (File file : dir.listFiles()) {
      dataSource.add(file.getName());
      folderPathList.add(file.getAbsolutePath());
    }

    return dataSource;

  }

}
