package com.goodow.drive.android.activity;

import com.goodow.api.services.account.Account;
import com.goodow.api.services.account.model.AccountInfo;
import com.goodow.drive.android.R;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
import com.goodow.drive.android.toolutils.SimpleProgressDialog;
import com.goodow.realtime.Realtime;

import com.google.inject.Inject;

import java.io.IOException;

import android.annotation.SuppressLint;
import android.content.DialogInterface;
import android.content.DialogInterface.OnCancelListener;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import roboguice.activity.RoboActivity;
import roboguice.inject.ContentView;
import roboguice.inject.InjectView;

@SuppressLint("SetJavaScriptEnabled")
@ContentView(R.layout.activity_login)
public class LogInActivity extends RoboActivity {
  private class LoginNetRequestTask extends AsyncTask<String, String, AccountInfo> {
    @Override
    protected AccountInfo doInBackground(String... params) {
      AccountInfo accountInfo = null;
      try {
        accountInfo = account.login(params[0], params[1]).execute();
      } catch (IOException e) {
        e.printStackTrace();
      }
      return accountInfo;
    }

    @Override
    protected void onPostExecute(AccountInfo result) {
      String errorMessage = "";

      do {
        if (this.isCancelled()) {
          break;
        }
        if (null == result || result.containsKey("error_message")) {
          errorMessage = "用户名或者密码错误!";
          break;
        }

        String userId = result.getUserId();
        String token = result.getToken();
        if (TextUtils.isEmpty(userId) || TextUtils.isEmpty(token)) {
          errorMessage = "服务器异常!";
          break;
        }
        GlobalDataCacheForMemorySingleton.getInstance.setUserName(usernameEditText.getText().toString());
        GlobalDataCacheForMemorySingleton.getInstance.setUserId(userId);
        GlobalDataCacheForMemorySingleton.getInstance.setAccess_token(token);

        // 通知。。。
        Realtime.authorize(userId, token);

        Intent intent = new Intent(LogInActivity.this, MainActivity.class);
        LogInActivity.this.startActivity(intent);

      } while (false);

      SimpleProgressDialog.dismiss(LogInActivity.this);

      if (!TextUtils.isEmpty(errorMessage)) {
        Toast.makeText(LogInActivity.this, "用户名或者密码错误!", Toast.LENGTH_SHORT).show();
      }

    }
  }

  @Inject
  private Account account;

  @InjectView(R.id.username_EditText)
  private EditText usernameEditText;

  @InjectView(R.id.password_EditText)
  private EditText passwordEditText;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Button loginButton = (Button) findViewById(R.id.login_Button);
    loginButton.setOnClickListener(new View.OnClickListener() {

      @Override
      public void onClick(View v) {
        String errorMessageString = "登录成功!";
        String username = "";
        String password = "";

        do {
          username = usernameEditText.getText().toString();
          if (TextUtils.isEmpty(username)) {
            errorMessageString = "用户名不能为空!";
            break;
          }

          password = passwordEditText.getText().toString();
          if (TextUtils.isEmpty(password)) {
            errorMessageString = "密码不能为空!";
            break;
          }

          String[] params = { username, password };
          final LoginNetRequestTask loginNetRequestTask = new LoginNetRequestTask();
          SimpleProgressDialog.show(LogInActivity.this, new OnCancelListener() {

            @Override
            public void onCancel(DialogInterface dialog) {
              loginNetRequestTask.cancel(true);
            }
          });
          loginNetRequestTask.execute(params);

          // 一切OK
          return;
        } while (false);

        // 用户输入的信息错误
        Toast.makeText(LogInActivity.this, errorMessageString, Toast.LENGTH_SHORT).show();
      }
    });
  }

  @Override
  protected void onPause() {
    super.onPause();

    SimpleProgressDialog.resetByThisContext(this);
  }
}
