package com.goodow.drive.android.activity;

import com.goodow.android.drive.R;
import com.goodow.drive.android.fragment.DataListFragment;
import com.goodow.drive.android.fragment.LeftMenuFragment;
import com.goodow.drive.android.fragment.LocalResFragment;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;

import roboguice.activity.RoboActivity;
import roboguice.inject.InjectView;
import roboguice.inject.ContentView;
import android.view.animation.AnimationUtils;
import android.view.animation.Animation;
import android.view.KeyEvent;
import android.widget.LinearLayout;
import android.view.View;
import android.app.FragmentTransaction;
import android.content.DialogInterface;
import android.app.AlertDialog;
import android.view.MenuItem;
import android.view.Menu;
import android.app.ActionBar;
import android.os.Bundle;

@ContentView(R.layout.activity_main)
public class MainActivity extends RoboActivity {
	private ActionBar actionBar;
	
	private boolean isDataListFragmentIn = false;
	private boolean isLocalResFragmentIn = false;

	@InjectView(R.id.leftMenuLayout)
	private LinearLayout leftMenu;
	@InjectView(R.id.middleLayout)
	private LinearLayout middleLayout;
	// @InjectFragment
	private LeftMenuFragment leftMenuFragment;
	private DataListFragment dataListFragment;
	private LocalResFragment localResFragment;

	/**
	 * @return the dataListFragment
	 */
	public DataListFragment getDataListFragment() {
		return dataListFragment;
	}

	/**
	 * @return the localResFragment
	 */
	public LocalResFragment getLocalResFragment() {
		return localResFragment;
	}

	public void hideLeftMenuLayout() {
		if (null != leftMenu && null != middleLayout) {
			Animation out = AnimationUtils.makeOutAnimation(this, false);
			leftMenu.startAnimation(out);

			leftMenu.setVisibility(LinearLayout.INVISIBLE);
			middleLayout.setVisibility(LinearLayout.INVISIBLE);
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
		if (keyCode == KeyEvent.KEYCODE_BACK) {
			if (isDataListFragmentIn) {
				dataListFragment.backFragment();
			}

			if (isLocalResFragmentIn) {
				localResFragment.backFragment();
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
	
	public void setActionBarTitle(String title){
		actionBar.setTitle(title);
	}
	
	public void restActionBarTitle(){
		actionBar.setTitle(R.string.app_name);
	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		actionBar = getActionBar();
		actionBar.setDisplayHomeAsUpEnabled(true);

		if (null == localResFragment) {
			localResFragment = new LocalResFragment();
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

	}

	public void setIsDataListFragmentIn(boolean flag) {
		this.isDataListFragmentIn = flag;
	}

	public void setIsLocalResFragmentIn(boolean flag) {
		this.isLocalResFragmentIn = flag;
	}

}
