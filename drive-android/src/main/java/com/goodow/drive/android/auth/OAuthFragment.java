package com.goodow.drive.android.auth;

import com.goodow.drive.android.HelloAndroidActivity;
import com.goodow.drive.android.R;
import com.goodow.drive.android.helloworld.DataListActivity;

import android.app.DialogFragment;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class OAuthFragment extends DialogFragment {
  private static class MyWebViewClient extends WebViewClient {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
      // check if the login was successful and the access token returned
      // this test depend of your API
      if (url.contains(UIT)) {
        // save your token
        // Intent intent = new Intent(activity, DataListActivity.class);
        // intent.putExtra("authorize", url);
        // activity.setTOKEN(url);
        // activity.startActivity(intent);

        String uid = url.substring(url.indexOf(UID) + UID.length(), url.indexOf(UIT));
        String uit = url.substring(url.indexOf(UIT) + UIT.length(), url.length());

        Log.i("LoginApp", uid + ":" + uit);

        return true;
      }
      Log.i(MyWebViewClient.class.getName(), "Login Failed");
      return false;
    }
  }

  private static final String UID = "#userId=";

  private static final String UIT = "&access_token=";

  private static HelloAndroidActivity activity;

  private WebView webViewOauth;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    // Retrieve the webview
    View v = inflater.inflate(R.layout.oauth_screen, container, false);
    webViewOauth = (WebView) v.findViewById(R.id.web_oauth);
    getDialog().setTitle("登录");
    return v;
  }

  @Override
  public void onViewCreated(View arg0, Bundle arg1) {
    super.onViewCreated(arg0, arg1);
    activity = (HelloAndroidActivity) this.getActivity();
    WebSettings webSettings = webViewOauth.getSettings();
    webSettings.setJavaScriptEnabled(true);

    // load the url of the oAuth login page
    webViewOauth.loadUrl("http://retech.goodow.com/good.js/good/auth/ServiceLogin.html");
    // webViewOauth.loadUrl("http://www.google.com");

    // set the web client
    webViewOauth.setWebViewClient(new MyWebViewClient());
    // activates JavaScript (just in case)
  }
}