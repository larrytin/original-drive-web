package com.goodow.drive.android.service;

import com.goodow.realtime.channel.constant.MessageType;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import elemental.json.Json;
import elemental.json.JsonObject;

public class DownloadBroadcastReceiver extends BroadcastReceiver {

  @Override
  public void onReceive(Context context, Intent intent) {
    String data = intent.getStringExtra(MessageType.DOWNLOAD.name());
    JsonObject json = Json.parse(data);
    String userId = json.getString("userId");
    String token = json.getString("token");
    String attachmentId = json.getString("attachmentId");
  }

}
