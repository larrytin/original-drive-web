package com.goodow.drive.android.toolutils;

import com.goodow.api.services.attachment.Attachment;
import com.goodow.drive.android.service.MediaDownloadService;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import android.app.Application;
import android.content.Intent;

@Singleton
public class MyApplication {
	private static Application application;
	private static Attachment attachment;

	public static Application getApplication() {
		return application;
	}

	public static Attachment getAttachment() {
		return attachment;
	}

	@Inject
	public MyApplication(Application application, Attachment attachment) {
		MyApplication.application = application;
		MyApplication.attachment = attachment;

		initApp();
	}

	private void initApp() {
		Intent intent = new Intent(application, MediaDownloadService.class);
		application.bindService(intent, new DownloadResServiceBinder(),
				Application.BIND_AUTO_CREATE);
	}
}
