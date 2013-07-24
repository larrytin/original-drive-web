package com.goodow.drive.android.fragment;

import android.app.ListFragment;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.goodow.android.drive.R;
import com.goodow.drive.android.activity.MainActivity;
import com.goodow.drive.android.activity.MainActivity.LocalFragmentEnum;
import com.goodow.drive.android.adapter.OfflineAdapter;
import com.goodow.drive.android.toolutils.OfflineFileObserver;

public class OfflineListFragment extends ListFragment {
	private OfflineAdapter adapter;

	public void backFragment() {

	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		adapter = new OfflineAdapter((MainActivity) this.getActivity(),
				OfflineFileObserver.getList());
		setListAdapter(adapter);

		return inflater.inflate(R.layout.fragment_folderlist, container, false);
	}

	@Override
	public void onActivityCreated(Bundle savedInstanceState) {
		super.onActivityCreated(savedInstanceState);

		IntentFilter intentFilter = new IntentFilter();
		intentFilter.addAction("NEW_RES_DOWNLOADING");
		((MainActivity) getActivity()).registerReceiver(
				new BroadcastReceiver() {
					@Override
					public void onReceive(Context context, Intent intent) {
						adapter.notifyDataSetChanged();
					}
				}, intentFilter);

		((MainActivity) getActivity())
				.setLocalFragmentEnum(LocalFragmentEnum.OFFLINELISTFRAGMENT);

	}

}