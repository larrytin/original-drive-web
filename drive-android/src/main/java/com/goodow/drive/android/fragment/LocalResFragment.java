package com.goodow.drive.android.fragment;

import java.io.File;
import java.util.ArrayList;

import android.app.ListFragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.Toast;

import com.goodow.android.drive.R;
import com.goodow.drive.android.activity.MainActivity;
import com.goodow.drive.android.adapter.LocalResAdapter;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;

public class LocalResFragment extends ListFragment {
	private LocalResAdapter localResAdapter;

	private ArrayList<File> folderList = new ArrayList<File>();
	// 保存当前级文件的父文件路径
	private String parentDirectory = null;

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		return inflater.inflate(R.layout.fragment_folderlist, container, false);
	}

	@Override
	public void onListItemClick(ListView l, View v, int position, long id) {
		File file = new File((String) v.getTag());

		if (file.isDirectory()) {
			parentDirectory = file.getParentFile().getAbsolutePath();
			initDataSource(file);
		}
	}

	public void backFragment() {
		if (null != parentDirectory) {
			initDataSource(new File(parentDirectory));

			if (parentDirectory.equals(GlobalDataCacheForMemorySingleton
					.getInstance().getUserResDirPath())) {
				parentDirectory = null;// 如果返回至用户文件夹,则置空父文件路径
			} else {
				parentDirectory = new File(parentDirectory).getParentFile()
						.getAbsolutePath();
			}

		} else {
			Toast.makeText(this.getActivity(), R.string.backFolderErro,
					Toast.LENGTH_SHORT).show();
		}
	}

	@Override
	public void onActivityCreated(Bundle savedInstanceState) {
		super.onActivityCreated(savedInstanceState);

		((MainActivity) this.getActivity()).setIsLocalResFragmentIn(true);
	}

	@Override
	public void onPause() {
		super.onPause();

		((MainActivity) this.getActivity()).setIsLocalResFragmentIn(false);
	}

	@Override
	public void onResume() {
		super.onResume();

		if (null == localResAdapter) {
			localResAdapter = new LocalResAdapter(folderList, this);
		}

		setListAdapter(localResAdapter);

		initDataSource(new File(
				GlobalDataCacheForMemorySingleton.getInstance
						.getUserResDirPath()));
	}

	public void delFile(File file) {
		if (file == null) {
			assert false : "入参file为空!";
			return;
		}

		if (file.isDirectory()) {
			for (File item : file.listFiles()) {
				if (item.isDirectory()) {
					delFile(item);
				} else {
					item.delete();
				}
			}
		}

		file.delete();
	}

	public void initDataSource(File dir) {
		if (dir == null) {
			assert false : "入参file为空!";
			return;
		}

		if (dir.exists() && dir.isDirectory()) {
			folderList.clear();

			for (File file : dir.listFiles()) {
				folderList.add(file);
			}
		}

		localResAdapter.notifyDataSetChanged();
	}
}
