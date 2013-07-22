package com.goodow.drive.android.service;

import java.io.OutputStream;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;
import com.goodow.drive.android.Interface.IDownloadProcess;
import com.google.api.client.extensions.android.http.AndroidHttp;
import com.google.api.client.googleapis.media.MediaHttpDownloader;
import com.google.api.client.googleapis.media.MediaHttpDownloaderProgressListener;
import com.google.api.client.googleapis.media.MediaHttpUploader;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.JsonObjectParser;
import com.google.api.client.json.jackson2.JacksonFactory;

public class MediaDownloadService extends Service {
	private BlockingQueue<String> downloadUrlQueue = new LinkedBlockingDeque<String>();

	private final IBinder myBinder = new MyBinder();

	private IDownloadProcess downloadProcess;

	private OutputStream out;

	public static final String TAG = "drive_download";

	public static final HttpTransport HTTP_TRANSPORT = AndroidHttp
			.newCompatibleTransport();

	public static final JsonFactory JSON_FACTORY = new JacksonFactory();

	public static final String URL_180M = "http://dzcnc.onlinedown.net/down/eclipse-SDK-4.2.2-win32.zip";

	public static final String URL_6M = "http://mirror.bjtu.edu.cn/apache/maven/maven-3/3.1.0-alpha-1/binaries/apache-maven-3.1.0-alpha-1-bin.zip";

	@Override
	public void onCreate() {
		super.onCreate();
		new Thread() {
			@Override
			public void run() {

				while (true) {
					try {
						final String urlString = MediaDownloadService.this.downloadUrlQueue
								.take();
						doDownLoad(urlString);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
			};
		}.start();
	}

	public final class MyBinder extends Binder {
		public void setDownLoadProgress(IDownloadProcess downloadProcess) {
			MediaDownloadService.this.downloadProcess = downloadProcess;
		}

		public void addResDownload(final String resUrl) {
			MediaDownloadService.this.downloadUrlQueue.add(resUrl);
		}
	}

	/**
	 * InnerClass: Media下载监听
	 */
	private class CustomProgressListener implements
			MediaHttpDownloaderProgressListener {
		@Override
		public void progressChanged(final MediaHttpDownloader downloader) {
			switch (downloader.getDownloadState()) {
			case MEDIA_IN_PROGRESS:
				if (downloadProcess != null) {
					downloadProcess.downLoadProgress((int) (downloader
							.getProgress() * 100));
				}

				break;

			case MEDIA_COMPLETE:
				if (downloadProcess != null) {
					downloadProcess.downLoadFinish();
				}

				break;

			default:
				break;

			}
		}
	}

	private void doDownLoad(String... params) {
		try {
			setOut(openFileOutput("task_test.zip", MODE_PRIVATE));

			MediaHttpDownloader downloader = new MediaHttpDownloader(
					HTTP_TRANSPORT, new HttpRequestInitializer() {
						@Override
						public void initialize(HttpRequest request) {
							request.setParser(new JsonObjectParser(JSON_FACTORY));
						}
					});
			// downloader.setDirectDownloadEnabled(true); //设为单块下载
			downloader.setChunkSize(MediaHttpUploader.MINIMUM_CHUNK_SIZE);
			Log.i(TAG, downloader.getChunkSize() + "");
			downloader.setProgressListener(new CustomProgressListener());

			downloader.download(new GenericUrl(params[0]), out);// 启动下载
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public IBinder onBind(Intent intent) {
		return myBinder;
	}

	public OutputStream getOut() {
		return out;
	}

	public void setOut(OutputStream out) {
		this.out = out;
	}

}
