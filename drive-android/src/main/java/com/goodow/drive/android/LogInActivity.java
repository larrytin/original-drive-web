package com.goodow.drive.android;

import com.goodow.drive.android.helloworld.DataListActivity;
import com.goodow.realtime.Realtime;
import com.google.api.client.extensions.android.http.AndroidHttp;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import android.webkit.WebSettings;
import android.util.Log;
import android.webkit.WebViewClient;
import android.webkit.WebView;
import android.content.Intent;
import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;

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
        Log.i("LoginApp", uid + ":" + uit);

        Realtime.authorize(uid, uit);

        Intent intent = new Intent(LogInActivity.this, DataListActivity.class);
        intent.putExtra("authorize", uid + "&&" + uit);
        LogInActivity.this.startActivity(intent);

        LogInActivity.this.finish();

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
    setContentView(R.layout.activity_main);

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

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.main, menu);
    return true;
  }

  // // Display the oAuth web page in a dialog
  // void showDialog() {
  // FragmentTransaction ft = getFragmentManager().beginTransaction();
  //
  // // Create and show the dialog.
  // newFragment = new OAuthFragment();
  // newFragment.show(ft, "dialog");
  // }
}
