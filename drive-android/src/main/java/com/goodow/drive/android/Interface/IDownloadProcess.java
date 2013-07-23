package com.goodow.drive.android.Interface;

import android.widget.ProgressBar;
import android.widget.TextView;

public interface IDownloadProcess {
	public void downLoadProgress(int progress, ProgressBar progressBar,
			TextView textView);

	public void downLoadFinish(ProgressBar progressBar, TextView textView);
}
