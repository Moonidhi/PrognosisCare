# Clear LocalStorage for Fresh Data

If appointments are not showing in the doctor dashboard, you may need to clear the browser's localStorage to force a refresh with the latest data.

## Method 1: Browser Console (Recommended)

1. Open your browser's Developer Tools (F12 or Right-click > Inspect)
2. Go to the **Console** tab
3. Paste this command and press Enter:

```javascript
localStorage.clear(); location.reload();
```

This will clear all stored data and reload the page with fresh sample appointments.

## Method 2: Manual Clear via Application Tab

1. Open Developer Tools (F12)
2. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click on **Local Storage** in the left sidebar
4. Click on your site URL (http://localhost:5175)
5. Right-click and select **Clear All**
6. Refresh the page (Cmd+R or Ctrl+R)

## Method 3: Hard Refresh

Try a hard refresh to bypass cache:
- **Mac**: Cmd + Shift + R
- **Windows/Linux**: Ctrl + Shift + R

## Verify Data Loaded

After clearing, refresh the app and confirm your dashboard/cards show data as expected.
You can also inspect browser console logs for seed refresh messages if enabled.

## Login Notes

Use the credentials configured in your local `.env` file for doctor/super-admin access.
Avoid storing real credentials in repository documentation.
