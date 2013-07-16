package com.goodow.drive.android.fragment;

import com.goodow.android.drive.R;
import com.goodow.realtime.CollaborativeMap;

import android.app.ListFragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

public class DataDetailFragment extends ListFragment {
	private CollaborativeMap file;

	public void setFile(CollaborativeMap file) {
		this.file = file;
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		return inflater.inflate(R.layout.fragment_folderlist, container, false);
	}
}
