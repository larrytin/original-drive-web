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
import com.goodow.drive.android.service.MediaDownloadService;
import com.goodow.drive.android.toolutils.SimpleDownloadResources;
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

	}

	public void initView() {
		if (null != file) {
			fileName.setText((String) file.get("label"));

			downloButton.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View v) {
					SimpleDownloadResources.getInstance
							.downloadResource(MediaDownloadService.URL_6M);

				}
			});
		}
	}
}
