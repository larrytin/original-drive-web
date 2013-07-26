package com.goodow.drive.android.adapter;

import android.annotation.SuppressLint;
import android.os.Handler;
import android.os.Message;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ProgressBar;
import android.widget.TextView;
import com.goodow.android.drive.R;
import com.goodow.drive.android.activity.MainActivity;
import com.goodow.realtime.CollaborativeList;
import com.goodow.realtime.CollaborativeMap;
import com.goodow.realtime.EventHandler;
import com.goodow.realtime.ValueChangedEvent;

public class OfflineAdapter extends BaseAdapter {
	private CollaborativeList offlineList;
	private MainActivity activity;

	private View row;
	private ProgressBar progressBar;
	private TextView textView;

	@SuppressLint("HandlerLeak")
	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			switch (msg.what) {
			case 1:
				int progress = msg.getData().getInt("progress");

				if (null != textView) {
					((TextView) row.findViewById(R.id.downloadText))
							.setText(progress + " %");
				}

				if (null != progressBar) {
					((ProgressBar) activity.findViewById(10))
							.setProgress(progress);
					progressBar.setProgress(progress);
				}

				break;
			case -1:
				if (null != textView) {
					textView.setText("100 %");
				}

				if (null != progressBar) {
					progressBar.setProgress(100);
				}

				break;
			}
		}
	};

	public OfflineAdapter(MainActivity activity, CollaborativeList offlineList) {
		this.offlineList = offlineList;
		this.activity = activity;
	}

	@Override
	public int getCount() {
		int count = (offlineList == null ? 0 : offlineList.length());
		return count;
	}

	@Override
	public Object getItem(int position) {
		return offlineList.get(position);
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
		//
		// // 使下载service能够更改UI界面,即修改进度条
		// SimpleDownloadResources.getInstance
		// .setDownloadProcess(new IDownloadProcess() {
		// @Override
		// public void downLoadProgress(int progress) {
		// progressBar.setProgress(progress);
		// downloadText.setText(progress + " %");
		//
		// }
		//
		// @Override
		// public void downLoadFinish() {
		// progressBar.setProgress(100);
		// downloadText.setText(100 + " %");
		// }
		// });
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
