package com.goodow.drive.android.toolutils;

import com.goodow.drive.android.Interface.IDownloadProcess;
import com.goodow.realtime.CollaborativeMap;

public enum SimpleDownloadResources {
	getInstance;

	public void addDownloadResource(final CollaborativeMap resource) {
		if (null == resource) {
			assert false : "入参urlOfResource为空.";
			return;
		}

		DownloadResServiceBinder.getDownloadResServiceBinder().addResDownload(
				resource);
	}

	public void removeDownloadResource(final CollaborativeMap resource) {
		if (null == resource) {
			assert false : "入参urlOfResource为空.";
			return;
		}

		DownloadResServiceBinder.getDownloadResServiceBinder()
				.removeResDownload(resource);
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
