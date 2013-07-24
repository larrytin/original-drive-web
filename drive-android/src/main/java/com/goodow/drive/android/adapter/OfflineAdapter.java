package com.goodow.drive.android.adapter;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ProgressBar;
import android.widget.TextView;
import com.goodow.android.drive.R;
import com.goodow.drive.android.activity.MainActivity;
import com.goodow.drive.android.toolutils.DownloadResServiceBinder;
import com.goodow.realtime.CollaborativeList;
import com.goodow.realtime.CollaborativeMap;
import com.goodow.realtime.EventHandler;
import com.goodow.realtime.ValueChangedEvent;

public class OfflineAdapter extends BaseAdapter {
	private CollaborativeList offline;
	private MainActivity activity;

	public OfflineAdapter(MainActivity activity, CollaborativeList offline) {
		this.offline = offline;
		this.activity = activity;
	}

	@Override
	public int getCount() {
		int count = (offline == null ? 0 : offline.length());
		return count;
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
	public View getView(final int position, View convertView, ViewGroup parent) {
		View row = activity.getLayoutInflater().inflate(
				R.layout.row_offlinelist, parent, false);

		final CollaborativeMap item = (CollaborativeMap) getItem(position);
		final TextView offlinefilename = (TextView) row
				.findViewById(R.id.offlineFileName);
		offlinefilename.setText((String) item.get("title"));

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

		// if (DownloadResServiceBinder.getDownloadResServiceBinder()
		// .getDownloadResBlobKey().equals(item.get("blobKey"))) {
		// activity.getIDownloadProcess().initData(progressBar, downloadText);
		// }

		item.addValueChangedListener(new EventHandler<ValueChangedEvent>() {
			@Override
			public void handleEvent(ValueChangedEvent event) {
				String newValue = event.getProperty();

				if ("progress".equals(newValue)) {
					int newProgress = Integer.parseInt((String) event
							.getNewValue());
					progressBar.setProgress(newProgress);
					downloadText.setText(newProgress + " %");

				}

				if ("status".equals(newValue)) {
					String newStatus = (String) event.getNewValue();
					downloadStatus.setText(newStatus);
				}
			}
		});

		return row;
	}

}
