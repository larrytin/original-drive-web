package com.goodow.drive.android.helloworld;

import com.goodow.drive.android.R;
import com.goodow.drive.android.R.id;
import com.goodow.drive.android.R.layout;
import com.goodow.drive.android.R.menu;
import com.goodow.realtime.CollaborativeList;
import com.goodow.realtime.CollaborativeMap;
import com.goodow.realtime.Document;
import com.goodow.realtime.DocumentLoadedHandler;
import com.goodow.realtime.EventHandler;
import com.goodow.realtime.EventType;
import com.goodow.realtime.Model;
import com.goodow.realtime.ModelInitializerHandler;
import com.goodow.realtime.Realtime;
import com.goodow.realtime.ValuesAddedEvent;

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

import java.io.OutputStream;

import android.widget.EditText;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

public class MediaDownloadActivity extends Activity {

  /**
   * InnerClass: Media下载监听
   */
  private class CustomProgressListener implements MediaHttpDownloaderProgressListener {
    @Override
    public void progressChanged(final MediaHttpDownloader downloader) {
      Message msg = new Message();

      switch (downloader.getDownloadState()) {
      case MEDIA_IN_PROGRESS:
        msg.what = 1;
        msg.getData().putDouble("progress", downloader.getProgress());
        handler.sendMessage(msg);

        break;
      case MEDIA_COMPLETE:
        msg.what = -1;
        handler.sendMessage(msg);

        Log.i(TAG, "Download is finish");
      }
    }
  }

  /**
   * InnerClass: 后台下载
   */
  private class DownlaodTask extends AsyncTask<String, Void, Bitmap> {
    @Override
    protected Bitmap doInBackground(String... params) {
      OutputStream out;
      try {
        out = openFileOutput("task_test.zip", MODE_PRIVATE);

        MediaHttpDownloader downloader = new MediaHttpDownloader(HTTP_TRANSPORT, new HttpRequestInitializer() {
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
      return null;
    }

  }

  public static final String TAG = "drive_download";

  public static final HttpTransport HTTP_TRANSPORT = AndroidHttp.newCompatibleTransport();

  public static final JsonFactory JSON_FACTORY = new JacksonFactory();

  public static final String DATA_KEY = "folders";

  public static final String URL_180M = "http://dzcnc.onlinedown.net/down/eclipse-SDK-4.2.2-win32.zip";

  public static final String URL_6M =
      "http://mirror.bjtu.edu.cn/apache/maven/maven-3/3.1.0-alpha-1/binaries/apache-maven-3.1.0-alpha-1-bin.zip";

  private TextView resultView;

  private ProgressBar progressBar;

  private Document doc;
  private Model model;
  private CollaborativeMap root;

  private Handler handler = new Handler() {
    @Override
    public void handleMessage(Message msg) {
      switch (msg.what) {
      case 1:
        resultView.setText((int) (msg.getData().getDouble("progress") * 100) + "%");
        progressBar.setProgress((int) (msg.getData().getDouble("progress") * 100));

        break;
      case -1:
        resultView.setText("Download is finished!");
        progressBar.setProgress(100);

        break;
      }
    }
  };

  //
  public void connectString() {
    CollaborativeList list = root.get(DATA_KEY);
    list.addValuesAddedListener(new EventHandler<ValuesAddedEvent>() {
      @Override
      public void handleEvent(ValuesAddedEvent event) {
        int index = event.getIndex();
        Object[] values = event.getValues();

        EditText edT = (EditText) findViewById(R.id.edT);
        edT.setText(values[0].toString());
        EventType type = event.getType();
      }
    });
  }

  public void intentManager(View view) {
    try {
      Intent i = new Intent(this, Class.forName(view.getTag().toString()));
      startActivity(i);
    } catch (ClassNotFoundException e) {
      e.printStackTrace();
    }
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_media);

    // Realtime.authorize("fakeToken", "fakeUser");
    // Realtime.load("@tmp/myFolders1", new DocumentLoadedHandler() {
    //
    // @Override
    // public void onLoaded(Document document) {
    // doc = document;
    // model = doc.getModel();
    // root = model.getRoot();
    //
    // connectString();
    // }
    // }, new ModelInitializerHandler() {
    //
    // @Override
    // public void onInitializer(Model model) {
    // HelloAndroidActivity.this.model = model;
    // root = model.getRoot();
    // }
    // }, null);

    resultView = (TextView) findViewById(R.id.progess);
    progressBar = (ProgressBar) findViewById(R.id.downloadbar);
    progressBar.setMax(100);
  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.main, menu);
    return true;
  }

  // save按钮的onclick事件
  public void onSave(View view) {
    DownlaodTask dt = new DownlaodTask();
    dt.execute(URL_180M);
    Toast.makeText(this, "Download is begining!", Toast.LENGTH_SHORT).show();
  }
}
