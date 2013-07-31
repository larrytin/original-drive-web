package com.goodow.drive.android.service;

import java.io.File;
import java.io.FileOutputStream;
import java.lang.Thread.State;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;
import android.annotation.SuppressLint;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import com.goodow.drive.android.Interface.IDownloadProcess;
import com.goodow.drive.android.global_data_cache.GlobalConstant;
import com.goodow.drive.android.global_data_cache.GlobalConstant.DownloadStatusEnum;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
import com.goodow.drive.android.module.DriveModule;
import com.goodow.realtime.CollaborativeMap;
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
	private final IBinder myBinder = new MyBinder();

	private BlockingQueue<CollaborativeMap> downloadUrlQueue = new LinkedBlockingDeque<CollaborativeMap>();
	private ResDownloadThread resDownloadThread = new ResDownloadThread();
	private HttpTransport HTTP_TRANSPORT = AndroidHttp.newCompatibleTransport();
	private JsonFactory JSON_FACTORY = new JacksonFactory();
	private CollaborativeMap downloadRes;
	private IDownloadProcess downloadProcess;

	public static final String URL_180M = "http://dzcnc.onlinedown.net/down/eclipse-SDK-4.2.2-win32.zip";
	public static final String URL_6M = "http://mirror.bjtu.edu.cn/apache/maven/maven-3/3.1.0-alpha-1/binaries/apache-maven-3.1.0-alpha-1-bin.zip";

	@SuppressLint("HandlerLeak")
	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			switch (msg.what) {
			case 1:
				int progress = msg.getData().getInt("progress");
				downloadProcess.downLoadProgress(progress);

				break;
			case -1:
				downloadProcess.downLoadFinish();

				break;
			}
		}
	};

	private void startResDownloadTread(final CollaborativeMap res) {
		// 广播通知离线文件夹界面刷新
		Intent intent = new Intent();
		intent.setAction("NEW_RES_DOWNLOADING");
		getBaseContext().sendBroadcast(intent);

		// 这里会发生阻塞, 这里阻塞很危险, 会导致ANR, 所以还是不要使用 BlockingQueue
		downloadUrlQueue.add(res);

		State state = resDownloadThread.getState();
		switch (state) {
		// 线程被阻塞，在等待一个锁。
		case BLOCKED:

			break;
		// 线程已被创建，但从未启动
		case NEW:
			resDownloadThread.start();

			break;
		// 线程可能已经运行
		case RUNNABLE:

			break;
		// 线程已被终止
		case TERMINATED:
			// note : 如果下载线程被异常终止了, 就重新创建一个
			resDownloadThread = new ResDownloadThread();
			resDownloadThread.start();

			break;
		// 线程正在等待一个指定的时间。
		case TIMED_WAITING:

			break;
		default:
			break;
		}
	}

	private class ResDownloadThread extends Thread {
		public void run() {
			try {
				while (true) {
					downloadRes = MediaDownloadService.this.downloadUrlQueue
							.take();

					if (!GlobalConstant.DownloadStatusEnum.COMPLETE.getStatus()
							.equals(downloadRes.get("status"))) {

						// 广播通知离线文件夹界面刷新
						Intent intent = new Intent();
						intent.setAction("NEW_RES_DOWNLOADING");
						getBaseContext().sendBroadcast(intent);

						downloadRes.set("status", "downloading");

						final String urlString = downloadRes.get("url");
						doDownLoad(urlString);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public final class MyBinder extends Binder {
		public String getDownloadResBlobKey() {

			return MediaDownloadService.this.downloadRes.get("blobKey");
		}

		public void setDownLoadProgress(IDownloadProcess downloadProcess) {
			MediaDownloadService.this.downloadProcess = downloadProcess;
		}

		public void addResDownload(final CollaborativeMap res) {
			startResDownloadTread(res);
		}

		public void removeResDownload(final CollaborativeMap res) {
			MediaDownloadService.this.downloadUrlQueue.remove(res);

			// Iterator<CollaborativeMap> iterator =
			// downloadUrlQueue.iterator();
			//
			// while (iterator.hasNext()) {
			// CollaborativeMap localRes = iterator.next();
			// if (null != localRes.get("url") && null != res.get("url")
			// && localRes.get("url").equals(res.get("url"))) {
			// downloadUrlQueue.remove(localRes);
			// }
			// }
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

					Message message = new Message();
					message.what = 1;
					message.getData().putInt("progress",
							(int) (downloader.getProgress() * 100));

					handler.sendMessage(message);
				}

				downloadRes.set("progress", Integer.toString((int) (downloader
						.getProgress() * 100)));

				break;
			case MEDIA_COMPLETE:
				if (downloadProcess != null) {
					Message message = new Message();
					message.what = -1;

					handler.sendMessage(message);
				}

				downloadRes.set("progress", "100");
				downloadRes.set("status",
						DownloadStatusEnum.COMPLETE.getStatus());

				break;
			default:

				break;
			}
		}
	}

	private void doDownLoad(String... params) {
		try {
			File newFile = new File(
					GlobalDataCacheForMemorySingleton.getInstance
							.getOfflineResDirPath()
							+ "/"
							+ downloadRes.get("blobKey"));
			FileOutputStream outputStream = new FileOutputStream(newFile);

			MediaHttpDownloader downloader = new MediaHttpDownloader(
					HTTP_TRANSPORT, new HttpRequestInitializer() {
						@Override
						public void initialize(HttpRequest request) {
							request.setParser(new JsonObjectParser(JSON_FACTORY));
						}
					});

			if (DriveModule.DRIVE_SERVER.endsWith(".goodow.com")) {
				downloader.setDirectDownloadEnabled(false);// 设为多块下载
				downloader.setChunkSize(MediaHttpUploader.MINIMUM_CHUNK_SIZE);// 设置每一块的大小

			} else {
				downloader.setDirectDownloadEnabled(true); // 设为单块下载

			}

			downloader.setProgressListener(new CustomProgressListener());// 设置监听器

			downloader.download(new GenericUrl(params[0]), outputStream);// 启动下载
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public IBinder onBind(Intent intent) {

		return myBinder;
	}

}
