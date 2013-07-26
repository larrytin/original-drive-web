package com.goodow.drive.android.activity;

import roboguice.activity.RoboActivity;
import roboguice.inject.ContentView;
import roboguice.inject.InjectView;
import android.app.ActionBar;
import android.app.AlertDialog;
import android.app.FragmentTransaction;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import com.goodow.android.drive.R;
import com.goodow.drive.android.Interface.IRemoteDataFragment;
import com.goodow.drive.android.fragment.DataDetailFragment;
import com.goodow.drive.android.fragment.DataListFragment;
import com.goodow.drive.android.fragment.LeftMenuFragment;
import com.goodow.drive.android.fragment.LessonListFragment;
import com.goodow.drive.android.fragment.OfflineListFragment;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;

@ContentView(R.layout.activity_main)
public class MainActivity extends RoboActivity {
	private IRemoteDataFragment iRemoteDataFragment;
	private IRemoteDataFragment lastiRemoteDataFragment;

	private ActionBar actionBar;

	@InjectView(R.id.leftMenuLayout)
	private LinearLayout leftMenu;
	@InjectView(R.id.middleLayout)
	private LinearLayout middleLayout;
	@InjectView(R.id.dataDetailLayout)
	private LinearLayout dataDetailLayout;

	private TextView openFailure_text;
	private ImageView openFailure_img;

	// @InjectFragment
	private LeftMenuFragment leftMenuFragment;
	private DataListFragment dataListFragment;
	// private LocalResFragment localResFragment;
	private OfflineListFragment offlineListFragment;
	private DataDetailFragment dataDetailFragment;
	private LessonListFragment lessonListFragment;

	public DataDetailFragment getDataDetailFragment() {
		return dataDetailFragment;
	}

	public DataListFragment getDataListFragment() {
		return dataListFragment;
	}

	public OfflineListFragment getOfflineListFragment() {
		return offlineListFragment;
	}

	public LessonListFragment getLessonListFragment() {
		return lessonListFragment;
	}

	public void hideLeftMenuLayout() {
		if (null != leftMenu && null != middleLayout) {
			Animation out = AnimationUtils.makeOutAnimation(this, false);
			leftMenu.startAnimation(out);

			leftMenu.setVisibility(LinearLayout.INVISIBLE);
			middleLayout.setVisibility(LinearLayout.INVISIBLE);
		}
	}

	public void setDataDetailLayoutState(int state) {
		if (dataDetailLayout.getVisibility() != state) {
			Animation animation;

			if (state == View.VISIBLE) {
				animation = AnimationUtils.makeInAnimation(this, false);
			} else {
				animation = AnimationUtils.makeOutAnimation(this, true);
			}

			dataDetailLayout.startAnimation(animation);
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
		if (keyCode == KeyEvent.KEYCODE_BACK && null != iRemoteDataFragment) {
			iRemoteDataFragment.backFragment();

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

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		actionBar = getActionBar();
		actionBar.setDisplayHomeAsUpEnabled(true);

		if (null == offlineListFragment) {
			offlineListFragment = new OfflineListFragment();
		}

		if (null == dataListFragment) {
			dataListFragment = new DataListFragment();
		}

		if (null == lessonListFragment) {
			lessonListFragment = new LessonListFragment();
		}

		if (null == dataDetailFragment) {
			dataDetailFragment = new DataDetailFragment();

			FragmentTransaction fragmentTransaction = getFragmentManager()
					.beginTransaction();
			fragmentTransaction.replace(R.id.dataDetailLayout,
					dataDetailFragment);
			fragmentTransaction.commit();
		}

		if (null == leftMenuFragment) {
			leftMenuFragment = new LeftMenuFragment();

			FragmentTransaction fragmentTransaction = getFragmentManager()
					.beginTransaction();
			fragmentTransaction.replace(R.id.leftMenuLayout, leftMenuFragment);
			fragmentTransaction.commit();
		}

		middleLayout.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				hideLeftMenuLayout();
			}
		});

	}

	public void setIRemoteFrament(IRemoteDataFragment iRemoteDataFragment) {
		this.iRemoteDataFragment = iRemoteDataFragment;
	}

	public IRemoteDataFragment getLastiRemoteDataFragment() {
		return lastiRemoteDataFragment;
	}

	public void setLastiRemoteDataFragment(
			IRemoteDataFragment lastiRemoteDataFragment) {
		this.lastiRemoteDataFragment = lastiRemoteDataFragment;
	}

	public void openState(int visibility) {
		if (null != openFailure_text) {
			openFailure_text.setVisibility(visibility);
		}
		if (null != openFailure_img) {
			openFailure_img.setVisibility(visibility);
		}
	}

	public void setOpenStateView(TextView textView, ImageView imageView) {
		openFailure_text = textView;
		openFailure_img = imageView;
	}
}
