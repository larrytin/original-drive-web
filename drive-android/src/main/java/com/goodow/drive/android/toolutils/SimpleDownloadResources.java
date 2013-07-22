package com.goodow.drive.android.toolutils;

import android.text.TextUtils;
import com.goodow.drive.android.Interface.IDownloadProcess;

public enum SimpleDownloadResources {
	getInstance;

	public void downloadResource(final String urlOfResource) {
		if (TextUtils.isEmpty(urlOfResource)) {
			assert false : "入参urlOfResource为空.";
			return;
		}

		DownloadResServiceBinder.getDownloadResServiceBinder().addResDownload(
				urlOfResource);
	}

	public void setDownloadProcess(final IDownloadProcess process) {
		if (process == null) {
			assert false : "入参process为空.";
			return;
		}

		DownloadResServiceBinder.getDownloadResServiceBinder()
				.setDownLoadProgress(process);
	}
}
