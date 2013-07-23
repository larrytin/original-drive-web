package com.goodow.drive.android.adapter;

import com.goodow.android.drive.R;
import com.goodow.drive.android.activity.MainActivity;
import com.goodow.drive.android.global_data_cache.GlobalConstant.DownloadStatusEnum;
import com.goodow.realtime.CollaborativeList;
import com.goodow.realtime.CollaborativeMap;
import com.goodow.realtime.EventHandler;
import com.goodow.realtime.ValueChangedEvent;

import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ProgressBar;
import android.widget.TextView;

public class OfflineAdapter extends BaseAdapter {
	private CollaborativeList offline;
	private MainActivity activity;

	public OfflineAdapter(MainActivity activity, CollaborativeList offline) {
		super();
		this.offline = offline;
		this.activity = activity;
	}

	@Override
	public int getCount() {
		return offline.length();
	}

	@Override
	public Object getItem(int position) {
		return offline.get(position);
	}

	@Override
	public long getItemId(int position) {
		return position;
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		View row = convertView;
		if (null == row) {
			row = activity.getLayoutInflater().inflate(
					R.layout.row_offlinelist, parent, false);
		}

		CollaborativeMap item = (CollaborativeMap) getItem(position);
		final TextView offlinefilename = (TextView) row
				.findViewById(R.id.offlineFileName);
		offlinefilename.setText((String) item.get("name"));

		final ProgressBar progressBar = (ProgressBar) row
				.findViewById(R.id.downloadBar);
		final TextView downloadText = (TextView) row
				.findViewById(R.id.downloadText);
		String progress = item.get("progress");
		if (null != progress) {
			progressBar.setProgress(Integer.parseInt(progress));
			downloadText.setText(progress + " %");
		}

		final TextView downloadStatus = (TextView) row
				.findViewById(R.id.downloadStatus);
		downloadStatus.setText((String) item.get("status"));

		item.addValueChangedListener(new EventHandler<ValueChangedEvent>() {
			@Override
			public void handleEvent(ValueChangedEvent event) {
				if ("progress".equals(event.getProperty())) {
					int newValue = Integer.parseInt((String) event
							.getNewValue());

					// activity.getProcess().downLoadProgress(newValue,
					// progressBar, downloadText);

					progressBar.setProgress(newValue);
					downloadText.setText(newValue + " %");
				}

				if ("status".equals(event.getProperty())) {
					// activity.getProcess().downLoadFinish(progressBar,
					// downloadText);
					
					progressBar.setProgress(100);
					downloadText.setText("100" + " %");
				}
			}
		});

		return row;
	}

}
