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
import com.goodow.drive.android.Interface.ILocalFragment;
import com.goodow.drive.android.activity.MainActivity;
import com.goodow.drive.android.adapter.OfflineAdapter;
import com.goodow.drive.android.toolutils.OfflineFileObserver;
import com.goodow.realtime.CollaborativeList;

public class OfflineListFragment extends ListFragment implements
		ILocalFragment {
	private OfflineAdapter adapter;

	private BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			adapter.notifyDataSetChanged();
		}

	};

	public void backFragment() {

	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		CollaborativeList list = OfflineFileObserver.getList();
		adapter = new OfflineAdapter((MainActivity) this.getActivity(), list);
		// list.addObjectChangedListener(new EventHandler<ObjectChangedEvent>()
		// {
		// @Override
		// public void handleEvent(ObjectChangedEvent event) {
		// adapter.notifyDataSetInvalidated();
		// }
		// });
		setListAdapter(adapter);

		return inflater.inflate(R.layout.fragment_folderlist, container, false);
	}

	@Override
	public void onActivityCreated(Bundle savedInstanceState) {
		super.onActivityCreated(savedInstanceState);

		((MainActivity) getActivity()).setIRemoteFrament(this);

		IntentFilter intentFilter = new IntentFilter();
		intentFilter.addAction("NEW_RES_DOWNLOADING");
		((MainActivity) getActivity()).registerReceiver(broadcastReceiver,
				intentFilter);

	}

	@Override
	public void onPause() {
		super.onPause();

		((MainActivity) getActivity()).unregisterReceiver(broadcastReceiver);
	}
}