package com.goodow.drive.android.Interface;

import android.widget.ProgressBar;
import android.widget.TextView;

public interface IDownloadProcess {
	public void initData(ProgressBar progressBar, TextView textView);

	public void downLoadProgress(int progress);

	public void downLoadFinish();
}
