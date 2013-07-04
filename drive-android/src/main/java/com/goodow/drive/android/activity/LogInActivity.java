package com.goodow.drive.android.activity;

import com.goodow.drive.android.R;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
import com.goodow.realtime.Realtime;

import com.google.api.client.extensions.android.http.AndroidHttp;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;

import java.io.File;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

@SuppressLint("SetJavaScriptEnabled")
public class LogInActivity extends Activity {
  private class MyWebViewClient extends WebViewClient {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
      // check if the login was successful and the access token returned
      // this test depend of your API
      if (url.contains(UIT)) {
        // save your token

        String uid = url.substring(url.indexOf(UID) + UID.length(), url.indexOf(UIT));
        String uit = url.substring(url.indexOf(UIT) + UIT.length(), url.length());
        GlobalDataCacheForMemorySingleton.getInstance.setUserId(uid);
        GlobalDataCacheForMemorySingleton.getInstance.setAccess_token(uit);

        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
          File file = new File(GlobalDataCacheForMemorySingleton.getInstance.getUserResDirPath());
          if (!file.exists()) {
            file.mkdir();
          }
        }

        Log.i("LoginApp", uid + ":" + uit);

        // 通知。。。
        Realtime.authorize(uid, uit);

        Intent intent = new Intent(LogInActivity.this, MainActivity.class);
        LogInActivity.this.startActivity(intent);

        return true;
      }
      Log.i(MyWebViewClient.class.getName(), "Login Failed");
      return false;
    }
  }

  private static final String UID = "#userId=";
  private static final String UIT = "&access_token=";
  private static final String URL = "http://retech.goodow.com/good.js/good/auth/ServiceLogin.html";
  // private OAuthFragment newFragment;
  private WebView webViewOauth;
  static final HttpTransport HTTP_TRANSPORT = AndroidHttp.newCompatibleTransport();
  static final JsonFactory JSON_FACTORY = new JacksonFactory();

  /**
   * Called when the activity is first created.
   * 
   * @param savedInstanceState If the activity is being re-initialized after previously being shut down then this Bundle contains the data
   *          it most recently supplied in onSaveInstanceState(Bundle). <b>Note: Otherwise it is null.</b>
   */
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_login);

    webViewOauth = (WebView) findViewById(R.id.web_oauth);

    WebSettings webSettings = webViewOauth.getSettings();
    webSettings.setJavaScriptEnabled(true);

    // load the url of the oAuth login page
    webViewOauth.loadUrl(URL);
    // webViewOauth.loadUrl("http://www.google.com");

    // set the web client
    webViewOauth.setWebViewClient(new MyWebViewClient());
    // activates JavaScript (just in case)
  }
}
