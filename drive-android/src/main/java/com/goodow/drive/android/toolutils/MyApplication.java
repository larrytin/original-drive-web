package com.goodow.drive.android.toolutils;

import com.goodow.drive.android.service.MediaDownloadService;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import android.app.Application;
import android.content.Intent;

@Singleton
public class MyApplication {
	private static Application application;

	public static Application getApplication() {
		return application;
	}

	@Inject
	public MyApplication(Application application) {
		MyApplication.application = application;

		initApp();
	}

	private void initApp() {
		Intent intent = new Intent(application, MediaDownloadService.class);
		application.bindService(intent, new DownloadResServiceBinder(),
				Application.BIND_AUTO_CREATE);
	}
}
