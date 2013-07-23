package com.goodow.drive.android.activity;

import roboguice.activity.RoboActivity;
import roboguice.inject.ContentView;
import roboguice.inject.InjectView;
import android.annotation.SuppressLint;
import android.app.ActionBar;
import android.app.AlertDialog;
import android.app.FragmentTransaction;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.goodow.android.drive.R;
import com.goodow.drive.android.Interface.IDownloadProcess;
import com.goodow.drive.android.fragment.DataDetailFragment;
import com.goodow.drive.android.fragment.DataListFragment;
import com.goodow.drive.android.fragment.LeftMenuFragment;
import com.goodow.drive.android.fragment.OfflineListFragment;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;

@ContentView(R.layout.activity_main)
public class MainActivity extends RoboActivity {
	public static enum LocalFragmentEnum {
		DATALISTFRAGMENT, LOCALRESFRAGMENT, DATADETAILFRAGMENT, OFFLINELISTFRAGMENT;
	}

	private LocalFragmentEnum localFragmentEnum;
	private LocalFragmentEnum lastFragmentEnum;

	private ActionBar actionBar;

	@InjectView(R.id.leftMenuLayout)
	private LinearLayout leftMenu;
	@InjectView(R.id.middleLayout)
	private LinearLayout middleLayout;
	@InjectView(R.id.dataDetailLayout)
	private LinearLayout dataDetailLayout;

	private ProgressBar progressBar;
	private TextView textView;

	private TextView openFailure_text;
	private ImageView openFailure_img;
	// @InjectFragment
	private LeftMenuFragment leftMenuFragment;
	private DataListFragment dataListFragment;
	// private LocalResFragment localResFragment;
	private OfflineListFragment offlineListFragment;
	private DataDetailFragment dataDetailFragment;

	public DataDetailFragment getDataDetailFragment() {
		return dataDetailFragment;
	}

	/**
	 * @return the dataListFragment
	 */
	public DataListFragment getDataListFragment() {
		return dataListFragment;
	}

	/**
	 * @return the localResFragment
	 */
	public OfflineListFragment getOfflineListFragment() {
		return offlineListFragment;
	}

	@SuppressLint("HandlerLeak")
	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			switch (msg.what) {
			case 1:
				int progress = (int) (msg.getData().getDouble("progress"));

				if (null != textView) {
					textView.setText(progress + " %");
				}

				if (null != progressBar) {
					progressBar.setProgress(progress);
				}

				break;
			case -1:
				if (null != textView) {
					textView.setText("100 %");
				}

				if (null != progressBar) {
					progressBar.setProgress(100);
				}

				break;
			}
		}
	};

	public void hideLeftMenuLayout() {
		if (null != leftMenu && null != middleLayout) {
			Animation out = AnimationUtils.makeOutAnimation(this, false);
			leftMenu.startAnimation(out);

			leftMenu.setVisibility(LinearLayout.INVISIBLE);
			middleLayout.setVisibility(LinearLayout.INVISIBLE);
		}
	}

	public void setDataDetailLayoutState(int state) {
		Animation animation;
		if (state == View.VISIBLE) {
			animation = AnimationUtils.makeInAnimation(this, false);

			setLastFragmentEnum(localFragmentEnum);
			setLocalFragmentEnum(LocalFragmentEnum.DATADETAILFRAGMENT);
		} else {
			animation = AnimationUtils.makeOutAnimation(this, true);

			setLocalFragmentEnum(lastFragmentEnum);
		}

		dataDetailLayout.startAnimation(animation);
		if (dataDetailLayout.getVisibility() != state) {
			dataDetailLayout.setVisibility(state);
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		super.onCreateOptionsMenu(menu);

		MenuItem back2Login = menu.add(0, 0, 0, R.string.actionBar_back);
		back2Login.setIcon(R.drawable.action_discussion_previous);
		back2Login.setShowAsAction(MenuItem.SHOW_AS_ACTION_IF_ROOM);

		return true;
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK && null != localFragmentEnum) {
			switch (localFragmentEnum) {
			case DATADETAILFRAGMENT:
				dataDetailFragment.backFragment();
				break;

			case DATALISTFRAGMENT:
				dataListFragment.backFragment();
				break;

			case OFFLINELISTFRAGMENT:
				offlineListFragment.backFragment();
				break;

			default:
				break;
			}

			return true;
		}

		return super.onKeyDown(keyCode, event);
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		super.onOptionsItemSelected(item);

		if (item.getItemId() == android.R.id.home) {
			if (leftMenu.getVisibility() == LinearLayout.VISIBLE) {
				hideLeftMenuLayout();

			} else {
				Animation in = AnimationUtils.makeInAnimation(this, true);
				leftMenu.startAnimation(in);

				leftMenu.setVisibility(LinearLayout.VISIBLE);
				middleLayout.setVisibility(LinearLayout.VISIBLE);

			}

		} else if (item.getItemId() == 0) {
			AlertDialog alertDialog = new AlertDialog.Builder(this)
					.setPositiveButton(R.string.dailogOK,
							new DialogInterface.OnClickListener() {

								@Override
								public void onClick(DialogInterface dialog,
										int which) {
									GlobalDataCacheForMemorySingleton.getInstance
											.setUserId(null);
									GlobalDataCacheForMemorySingleton.getInstance
											.setAccess_token(null);

									finish();
								}
							})
					.setNegativeButton(R.string.dailogCancel,
							new DialogInterface.OnClickListener() {

								@Override
								public void onClick(DialogInterface dialog,
										int which) {

								}
							}).setMessage(R.string.back_DailogMessage).create();

			alertDialog.show();
		}

		return true;
	}

	public void setActionBarTitle(String title) {
		actionBar.setTitle(title);
	}

	public void restActionBarTitle() {
		actionBar.setTitle(R.string.app_name);
	}

	private IDownloadProcess process = new IDownloadProcess() {

		@Override
		public void downLoadProgress(int progress, ProgressBar progressBar,
				TextView textView) {
			MainActivity.this.progressBar = progressBar;
			MainActivity.this.textView = textView;

			Message msg = new Message();
			msg.what = 1;
			msg.getData().putDouble("progress", progress);
			handler.sendMessage(msg);
		}

		@Override
		public void downLoadFinish(ProgressBar progressBar, TextView textView) {
			MainActivity.this.progressBar = progressBar;
			MainActivity.this.textView = textView;

			Message msg = new Message();
			msg.what = -1;
			handler.sendMessage(msg);
		}
	};

	public IDownloadProcess getProcess() {
		return process;
	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		actionBar = getActionBar();
		actionBar.setDisplayHomeAsUpEnabled(true);

		if (null == offlineListFragment) {
			offlineListFragment = new OfflineListFragment();
		}

		if (null == dataDetailFragment) {
			dataDetailFragment = new DataDetailFragment();

			FragmentTransaction fragmentTransaction = getFragmentManager()
					.beginTransaction();
			fragmentTransaction.replace(R.id.dataDetailLayout,
					dataDetailFragment);
			fragmentTransaction.commit();
		}

		if (null == dataListFragment) {
			dataListFragment = new DataListFragment();
		}

		if (null == leftMenuFragment) {
			leftMenuFragment = new LeftMenuFragment();
		}

		FragmentTransaction fragmentTransaction = getFragmentManager()
				.beginTransaction();
		fragmentTransaction.replace(R.id.leftMenuLayout, leftMenuFragment);
		fragmentTransaction.commit();

		middleLayout.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				hideLeftMenuLayout();
			}
		});

		// 使下载service能够更改UI界面,即修改进度条
		// SimpleDownloadResources.getInstance.setDownloadProcess(process);
	}

	public void setLastFragmentEnum(LocalFragmentEnum lastFragmentEnum) {
		this.lastFragmentEnum = lastFragmentEnum;
	}

	public void setLocalFragmentEnum(LocalFragmentEnum localFragmentEnum) {
		this.localFragmentEnum = localFragmentEnum;
	}

	public void openState(int visibility) {
		if (null != openFailure_text) {
			openFailure_text.setVisibility(visibility);
		}
		if (null != openFailure_img) {
			openFailure_img.setVisibility(visibility);
		}
	}

	public void setOpenStatView(TextView textView, ImageView imageView) {
		openFailure_text = textView;
		openFailure_img = imageView;
	}
}
