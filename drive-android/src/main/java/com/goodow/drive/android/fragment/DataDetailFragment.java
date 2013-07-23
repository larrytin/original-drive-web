package com.goodow.drive.android.fragment;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.goodow.android.drive.R;
import com.goodow.drive.android.activity.MainActivity;
import com.goodow.drive.android.global_data_cache.GlobalConstant.DownloadStatusEnum;
import com.goodow.drive.android.service.MediaDownloadService;
import com.goodow.drive.android.toolutils.OfflineFileObserver;
import com.goodow.realtime.CollaborativeMap;

public class DataDetailFragment extends Fragment {
	private CollaborativeMap file;
	private TextView fileName;
	private Button downloButton;

	public void backFragment() {
		((MainActivity) getActivity()).setDataDetailLayoutState(View.INVISIBLE);

	}

	public void setFile(CollaborativeMap file) {
		this.file = file;
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		return inflater.inflate(R.layout.fragment_datadetail, container, false);
	}

	@Override
	public void onResume() {
		super.onResume();

		fileName = (TextView) ((MainActivity) getActivity())
				.findViewById(R.id.fileName);
		
		downloButton = (Button) ((MainActivity) getActivity())
				.findViewById(R.id.downloadButton);
		downloButton.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				file.set("status", DownloadStatusEnum.WAITING.getStatus());

				OfflineFileObserver.addFile(file);
			}
		});

	}

	public void initView() {
		if (null != file) {
			fileName.setText((String) file.get("label"));

		}
	}
}
