package com.goodow.drive.android;

import com.goodow.drive.android.auth.OAuthFragment;
import com.goodow.drive.android.helloworld.DataListActivity;

import com.google.api.client.extensions.android.http.AndroidHttp;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.JsonObjectParser;
import com.google.api.client.json.jackson2.JacksonFactory;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import android.content.Intent;

import android.app.Activity;
import android.app.FragmentTransaction;
import android.os.Bundle;
import android.view.Menu;

public class HelloAndroidActivity extends Activity {
  private OAuthFragment newFragment;
  static String TOKEN;
  static final HttpTransport HTTP_TRANSPORT = AndroidHttp.newCompatibleTransport();
  static final JsonFactory JSON_FACTORY = new JacksonFactory();

  /**
   * @return the tOKEN
   */
  public String getTOKEN() {
    return TOKEN;
  }

  /**
   * Called when the activity is first created.
   * 
   * @param savedInstanceState If the activity is being re-initialized after previously being shut down then this Bundle contains the data
   *          it most recently supplied in onSaveInstanceState(Bundle). <b>Note: Otherwise it is null.</b>
   */
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Intent intent_ = new Intent(this, DataListActivity.class);
    // this.startActivity(intent_);

    if (null == TOKEN) {
      showDialog();
      return;
    }

    setContentView(R.layout.activity_main);

  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.main, menu);
    return true;
  }

  /**
   * @param tOKEN the tOKEN to set
   */
  public void setTOKEN(String tOKEN) {
    TOKEN = tOKEN;
  }

  @Override
  protected void onResume() {
    super.onResume();

    if (null != TOKEN && null != newFragment) {
      newFragment.dismiss();
    } else {
      showDialog();
      return;
    }
  }

  // Display the oAuth web page in a dialog
  void showDialog() {
    FragmentTransaction ft = getFragmentManager().beginTransaction();
    // ft.addToBackStack(null);

    // Create and show the dialog.
    newFragment = new OAuthFragment();
    newFragment.show(ft, "dialog");
  }
}
