package com.goodow.drive.android.module;

import java.io.File;

import android.os.Environment;

import com.goodow.api.services.account.Account;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
import com.goodow.realtime.android.CloudEndpointUtils;
import com.goodow.realtime.android.RealtimeModule;
import com.goodow.realtime.android.ServerAddress;

import com.google.api.client.extensions.android.http.AndroidHttp;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;

public class DriveModule extends AbstractModule {

	@Override
	protected void configure() {
		File file;
		String filePathString = "";
		File storage;

		if (Environment.getExternalStorageState().equals(
				Environment.MEDIA_MOUNTED)) {
			storage = Environment.getExternalStorageDirectory();
			filePathString = "/retech";
		} else {
			storage = Environment.getDataDirectory();
			filePathString = "/data/com.goodow.drive.android/retech";
		}

		file = new File(storage, filePathString);

		if (!file.exists()) {
			file.mkdir();
		}

		GlobalDataCacheForMemorySingleton.getInstance().setStoragePaht(
				file.getAbsolutePath());
	}

	@Provides
	@Singleton
	Account provideDevice(@ServerAddress String serverAddress) {
		Account.Builder endpointBuilder = new Account.Builder(
				AndroidHttp.newCompatibleTransport(), new JacksonFactory(),
				new HttpRequestInitializer() {
					@Override
					public void initialize(HttpRequest httpRequest) {
					}
				});
		endpointBuilder.setRootUrl(RealtimeModule
				.getEndpointRootUrl(serverAddress));
		return CloudEndpointUtils.updateBuilder(endpointBuilder).build();
	}
}
