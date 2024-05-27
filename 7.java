// MainActivity.java

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    EditText pincodeText;
    Button confirmButton;
    public static final String APP_PREF = "mySharedPreferences";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
        confirmButton = (Button) findViewById(R.id.confirmButton)
        confirmButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                checkPin();
            }
        })
	}

    protected void checkPin() {
        pincodeText = (EditText) findViewById(R.id.inputPin);
        final String validPin = readValidPin();
        String insertedPin = pincodeText.getText().toString();
        if (validPin.equals(insertedPin)) {
            Intent intent_protected_activity = new Intent(this, protected_activity.class);
            startActivity(intent_protected_activity);
        }
        else {
            Toast.makeText(MainActivity.this, "PIN is not correct, please try again.", 
                           Toast.LENGTH_SHORT).show();
            pincodeText.getText().clear();
        }
    }

    protected String readValidPin() {
        // Assume the pin is long enough to avoid brute forcing
        SharedPreferences settings = getSharedPreferences(APP_PREF, 0);
        String validPin = settings.getString("pin", null);
        return validPin;
    }
}

//----------------------------------------------------------------------------------------
// manifest.xml
//----------------------------------------------------------------------------------------

/*
<?xml version="1.0" encoding="UTF-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="nc.bank" android:versionCode="1" android:versionName="1.0">
  <uses-sdk android:minSdkVersion="8" android:targetSdkVersion="15" />
  <application android:icon="@drawable/ic_launcher" android:label="@string/app_name" android:theme="@style/AppTheme">
    <activity android:name="MainActivity" android:exported="true" android:label="@string/title_activity_main">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
    </activity>
    <activity android:name="nc.bank.protected_activity" android:exported="true">
      <intent-filter>
        <action android:name="android.intent.action.ACTION_VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="ncbank" android:pathPrefix="/" android:host="personaldetails" />
      </intent-filter>
    </activity>
  </application>
</manifest>
*/
Source Code Challenges








