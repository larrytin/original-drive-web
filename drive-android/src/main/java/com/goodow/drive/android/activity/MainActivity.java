package com.goodow.drive.android.activity;

import roboguice.activity.RoboActivity;
import roboguice.inject.ContentView;
import roboguice.inject.InjectView;
import android.app.ActionBar;
import android.app.AlertDialog;
import android.app.Fragment;
import android.app.FragmentTransaction;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;
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
import com.goodow.drive.android.fragment.LocalResFragment;
import com.goodow.drive.android.fragment.OfflineListFragment;
import com.goodow.drive.android.global_data_cache.GlobalConstant;
import com.goodow.drive.android.global_data_cache.GlobalConstant.DocumentIdAndDataKey;
import com.goodow.drive.android.global_data_cache.GlobalDataCacheForMemorySingleton;
import com.goodow.drive.android.toolutils.ToolsFunctionForThisProgect;
import com.goodow.realtime.CollaborativeList;
import com.goodow.realtime.CollaborativeMap;
import com.goodow.realtime.Document;
import com.goodow.realtime.DocumentLoadedHandler;
import com.goodow.realtime.EventHandler;
import com.goodow.realtime.Model;
import com.goodow.realtime.ModelInitializerHandler;
import com.goodow.realtime.Realtime;
import com.goodow.realtime.ValueChangedEvent;

@ContentView(R.layout.activity_main)
public class MainActivity extends RoboActivity {
	private final String TAG = this.getClass().getSimpleName();

	private IRemoteDataFragment iRemoteDataFragment;
	private IRemoteDataFragment lastiRemoteDataFragment;

	private RemoteControlObserver remoteControlObserver;
	private ActionBar actionBar;

	@InjectView(R.id.leftMenuLayout)
	private LinearLayout leftMenu;
	@InjectView(R.id.middleLayout)
	private LinearLayout middleLayout;
	@InjectView(R.id.dataDetailLayout)
	private LinearLayout dataDetailLayout;

	private TextView openFailure_text;
	private ImageView openFailure_img;

	private LeftMenuFragment leftMenuFragment = new LeftMenuFragment();
	private DataListFragment dataListFragment = new DataListFragment();
	private LocalResFragment localResFragment = new LocalResFragment();
	private OfflineListFragment offlineListFragment = new OfflineListFragment();
	private DataDetailFragment dataDetailFragment = new DataDetailFragment();
	private LessonListFragment lessonListFragment = new LessonListFragment();

	public LocalResFragment getLocalResFragment() {

		return localResFragment;
	}

	public DataDetailFragment getDataDetailFragment() {
		return dataDetailFragment;
	}

	public void hideLeftMenuLayout() {
		if (null != leftMenu && null != middleLayout) {
			leftMenuFragment.hiddenView();

			Animation out = AnimationUtils.makeOutAnimation(this, false);
			out.setAnimationListener(new AnimationListener() {
				@Override
				public void onAnimationStart(Animation animation) {
				}

				@Override
				public void onAnimationRepeat(Animation animation) {
				}

				@Override
				public void onAnimationEnd(Animation animation) {
					leftMenu.setVisibility(LinearLayout.INVISIBLE);
					middleLayout.setVisibility(LinearLayout.INVISIBLE);
					setLeftMenuLayoutX(0);// 重置其位置,防止负数循环叠加
					setLeftMenuLayoutX(-leftMenu.getWidth());

				}
			});

			leftMenu.startAnimation(out);

		}
	}

	private void showLeftMenuLayout() {
		Animation in = AnimationUtils.makeInAnimation(this, true);
		leftMenu.startAnimation(in);
		leftMenu.setVisibility(LinearLayout.VISIBLE);
		leftMenuFragment.showView();

	}

	private void setLeftMenuLayoutX(int x) {
		leftMenu.layout(x, leftMenu.getTop(), leftMenu.getRight(),
				leftMenu.getBottom());
		Log.i("Scorll", "set:" + leftMenu.getLeft());
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
		back2Login.setIcon(R.drawable.discussion_indicator_opened);
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
				setLeftMenuLayoutX(0);
				showLeftMenuLayout();
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

									Intent intent = new Intent(
											MainActivity.this,
											LogInActivity.class);
									startActivity(intent);
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

		GlobalDataCacheForMemorySingleton.getInstance.addActivity(this);

		actionBar = getActionBar();
		actionBar.setDisplayHomeAsUpEnabled(true);

		FragmentTransaction fragmentTransaction = getFragmentManager()
				.beginTransaction();

		fragmentTransaction.replace(R.id.dataDetailLayout, dataDetailFragment);

		fragmentTransaction.replace(R.id.leftMenuLayout, leftMenuFragment);

		fragmentTransaction.commitAllowingStateLoss();

		middleLayout.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				hideLeftMenuLayout();

			}
		});

		String docId = "@tmp/"
				+ GlobalDataCacheForMemorySingleton.getInstance().getUserId()
				+ "/"
				+ GlobalConstant.DocumentIdAndDataKey.REMOTECONTROLDOCID
						.getValue();

		remoteControlObserver = new RemoteControlObserver();
		remoteControlObserver.startObservation(docId);

	}

	@Override
	protected void onRestart() {
		// TODO Auto-generated method stub
		super.onRestart();
	}

	@Override
	protected void onStart() {
		// TODO Auto-generated method stub
		super.onStart();
	}

	@Override
	protected void onResume() {
		// TODO Auto-generated method stub
		super.onResume();
	}

	@Override
	protected void onPause() {
		// TODO Auto-generated method stub
		super.onPause();
	}

	@Override
	protected void onStop() {
		// TODO Auto-generated method stub
		super.onStop();
	}

	@Override
	protected void onDestroy() {
		// TODO Auto-generated method stub
		super.onDestroy();
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

	private void switchFragment(DocumentIdAndDataKey doc) {
		if (null != doc) {
			Fragment newFragment = null;

			switch (doc) {
			case LESSONDOCID:
				newFragment = lessonListFragment;

				break;
			case FAVORITESDOCID:
				newFragment = dataListFragment;

				break;
			case OFFLINEDOCID:
				newFragment = offlineListFragment;

				break;
			default:
				break;
			}

			if (newFragment != null) {
				FragmentTransaction fragmentTransaction = getFragmentManager()
						.beginTransaction();
				fragmentTransaction.replace(R.id.contentLayout, newFragment);
				fragmentTransaction.commitAllowingStateLoss();
			}
		}
	}

	public RemoteControlObserver getRemoteControlObserver() {

		return remoteControlObserver;
	}

	public class RemoteControlObserver {
		private Document doc;
		private Model model;
		private CollaborativeMap root;
		private CollaborativeMap map;
		private CollaborativeList list;

		public CollaborativeList getList() {

			return list;
		}

		public void changeMapItem(String docId) {
			if (null != map) {
				map.set(GlobalConstant.DocumentIdAndDataKey.CURRENTDOCIDKEY
						.getValue(), docId);

			}
		}

		public void clearList() {
			if (null != list && 0 < list.length()) {
				list.clear();

			}
		}

		private void startObservation(String docId) {
			DocumentLoadedHandler onLoaded = new DocumentLoadedHandler() {
				@Override
				public void onLoaded(Document document) {
					doc = document;
					model = doc.getModel();
					root = model.getRoot();
					map = root.get(GlobalConstant.DocumentIdAndDataKey.PATHKEY
							.getValue());
					list = map
							.get(GlobalConstant.DocumentIdAndDataKey.CURRENTPATHKEY
									.getValue());

					String currentDocId = map
							.get(GlobalConstant.DocumentIdAndDataKey.CURRENTDOCIDKEY
									.getValue());

					currentDocId = currentDocId.substring(currentDocId
							.lastIndexOf("/") + 1);

					DocumentIdAndDataKey doc = DocumentIdAndDataKey
							.getEnumWithValue(currentDocId);

					switchFragment(doc);

					map.addValueChangedListener(new EventHandler<ValueChangedEvent>() {
						@Override
						public void handleEvent(ValueChangedEvent event) {
							String property = event.getProperty();
							if (GlobalConstant.DocumentIdAndDataKey.CURRENTDOCIDKEY
									.getValue().equals(property)) {
								String newValue = (String) event.getNewValue();

								newValue = newValue.substring(newValue
										.lastIndexOf("/") + 1);

								DocumentIdAndDataKey doc = DocumentIdAndDataKey
										.getEnumWithValue(newValue);

								switchFragment(doc);

								clearList();

							}
						}
					});
				}
			};

			ModelInitializerHandler initializer = new ModelInitializerHandler() {
				@Override
				public void onInitializer(Model model_) {
					model = model_;
					root = model.getRoot();

					CollaborativeMap newMap = model.createMap(null);
					CollaborativeList newList = model.createList();
					newMap.set(
							GlobalConstant.DocumentIdAndDataKey.CURRENTPATHKEY
									.getValue(), newList);
					root.set(GlobalConstant.DocumentIdAndDataKey.PATHKEY
							.getValue(), newMap);
				}
			};

			Realtime.load(docId, onLoaded, initializer, null);
		}

	}

	private float startPoint = 0;

	@Override
	public boolean onTouchEvent(MotionEvent event) {
		switch (event.getAction()) {
		case MotionEvent.ACTION_DOWN:
			if (leftMenu.getVisibility() == View.INVISIBLE) {
				showLeftMenuLayout();
			}
			Log.i("Scorll", "DOWN:" + leftMenu.getLeft());
			startPoint = event.getX();

			break;
		case MotionEvent.ACTION_UP:
			Log.i("Scorll", "UP:" + leftMenu.getLeft());
			if (Math.abs(leftMenu.getLeft()) > leftMenu.getWidth() / 4) {
				hideLeftMenuLayout();

			} else {
				setLeftMenuLayoutX(0);
				middleLayout.setVisibility(View.VISIBLE);

			}

			startPoint = 0;

			break;
		case MotionEvent.ACTION_MOVE:
			do {
				if (startPoint >= event.getX()) {
					break;
				}

				if (leftMenu.getLeft() >= 0) {
					break;
				}

				int add = leftMenu.getLeft() + 4;
				if (add < 0) {
					setLeftMenuLayoutX(add);

				} else {
					setLeftMenuLayoutX(0);

				}

				if (leftMenu.getLeft() >= 0) {
					middleLayout.setVisibility(View.VISIBLE);

				}
			} while (false);

			break;
		default:

			break;
		}

		return true;
	}

}
