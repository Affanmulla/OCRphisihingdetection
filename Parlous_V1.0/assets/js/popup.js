// Google Analytics Tracking =================================================================

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45190281-6']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// Add event tracking to G+ profile link
document.addEventListener('DOMContentLoaded', function()
{
    document.getElementById('profile_link').addEventListener('click', function()
    {
        _gaq.push(['_trackEvent', 'Links', 'Clicked', 'Author']);
    });
});

// ===========================================================================================


function disable_ab ()
{
    window.open('?','_self');
}


function enable_ab ()
{
    chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    return { cancel: false };
  },
  { urls: defaultFilters },
  ["blocking"]
);


    window.open('?','_self');


    
}
/**
 * Background implementation of disabling CSS. This means
 * updating the extension storage.
 */
function disable_css ()
{
    chrome.storage.sync.set({ 'disable_css': true });
}



/**
 * Background implementation of enabling CSS. This means
 * updating the extension storage.
 */
function enable_css ()
{
    chrome.storage.sync.remove('disable_css');
}



/**
 * This function disables javascript using the contentSettings
 * API.
 */
function disable_javascript ()
{
    update_content_settings('javascript', 'block');
}



/**
 * This function enables javascript using the contentSettings
 * API.
 */
function enable_javascript ()
{
    update_content_settings('javascript', 'allow');
}



/**
 * This function disables images using the contentSettings
 * API.
 */
function disable_images ()
{
    update_content_settings('images', 'block');
}



/**
 * This function enables images using the contentSettings
 * API.
 */
function enable_images ()
{
    update_content_settings('images', 'allow');
}



/**
 * This function disables cookies using the contentSettings
 * API.
 */
function disable_cookies ()
{
    update_content_settings('cookies', 'block');
}



/**
 * This function enables cookies using the contentSettings
 * API.
 */
function enable_cookies ()
{
    update_content_settings('cookies', 'allow');
}



/**
 * This function disables popups using the contentSettings
 * API.
 */
function disable_popups ()
{
    update_content_settings('popups', 'block');
}



/**
 * This function enables popups using the contentSettings
 * API.
 */
function enable_popups ()
{
    update_content_settings('popups', 'allow');
}



/**
 * Updates internal settings using the contentSettings API.
 */
function update_content_settings (type, value)
{
    chrome.contentSettings[type].set({
        'primaryPattern': '<all_urls>',
        'setting': value,
        'scope': 'regular'
    });
}



// ADBLOCKER
function update_buttons_ab ()
{
    var button_id_disable = document.getElementById('button-ab-disable');
    var button_id_enable  = document.getElementById('button-ab-enable');

    // if (enable_button_ab)
    // {
    //     button_id_enable.className  = button_ab_enable.className + ' active';
    //     button_id_disable.className = button_ab_disable.className.replace(/active/g, '');
    // }

    // else
    // {
    //     button_id_disable.className = button_ab_disable.className + ' active';
    //     button_id_enable.className  = button_ab_enable.className.replace(/active/g, '');
    // }
}


/**
 * Updates CSS buttons in popup.
 */
function update_buttons_css ()
{
    chrome.storage.sync.get('disable_css', function (items)
    {
        var button_css_disable = document.getElementById('button-css-disable');
        var button_css_enable  = document.getElementById('button-css-enable');

        if (items.disable_css === true)
        {
            button_css_disable.className = button_css_disable.className + ' active';
            button_css_enable.className = button_css_enable.className.replace(/active/g, '');
        }
        else
        {
            button_css_enable.className = button_css_enable.className + ' active';
            button_css_disable.className = button_css_disable.className.replace(/active/g, '');
        }
    });
}



/**
 * Updates javascript buttons in popup.
 */
function update_buttons_javascript ()
{
    update_buttons('javascript', 'button-js-enable', 'button-js-disable');
}



/**
 * Updates images buttons in popup.
 */
function update_buttons_images ()
{
    update_buttons('images', 'button-images-enable', 'button-images-disable');
}



/**
 * Updates images cookies in popup.
 */
function update_buttons_cookies ()
{
    update_buttons('cookies', 'button-cookies-enable', 'button-cookies-disable');
}



/**
 * Updates images popups in popup.
 */
function update_buttons_popups ()
{
    update_buttons('popups', 'button-popups-enable', 'button-popups-disable');
}



/**
 * Updates the buttons for a given type based on current settings
 * in contentSettings for active tab.
 */
function update_buttons (type, enable_button_id, disable_button_id)
{
    chrome.tabs.query({'currentWindow':true, 'active':true}, function(tabs)
    {
        var url = tabs[0].url;

        chrome.contentSettings[type].get({'primaryUrl': url }, function (details)
        {
            var button_id_disable = document.getElementById(disable_button_id);
            var button_id_enable  = document.getElementById(enable_button_id);

            if (details.setting == 'allow')
            {
                button_id_enable.className  = button_id_enable.className + ' active';
                button_id_disable.className = button_id_disable.className.replace(/active/g, '');
            }

            else
            {
                button_id_disable.className = button_id_disable.className + ' active';
                button_id_enable.className  = button_id_enable.className.replace(/active/g, '');
            }
        });
    });
}



/**
 * This function checks if info box should be displayed and displays it
 * if necessary.
 */
function show_info_box ()
{
    // Check storage if info box should be displayed or not
    chrome.storage.sync.get('disable_info', function (items)
    {
        if (items.disable_info !== true)
        {
            var info_box = document.getElementById('info-box');
            var checkbox = document.getElementById('info-box-checkbox');

            // Make message box visible
            info_box.className = info_box.className + ' show';

            // Add listener to checkbox
            checkbox.addEventListener('change', function()
            {
                chrome.storage.sync.set({ 'disable_info': (checkbox.checked === true) });

                _gaq.push(['_trackEvent', 'Info-Box', 'hide-checkbox', (checkbox.checked === true) ? 'checked' : 'unchecked']);
            });
        }
    });
}



/**
 * This function closes the info box.
 */
function close_info_box ()
{
    var info_box = document.getElementById('info-box');

    info_box.className = info_box.className.replace(/show/g, '');
}



/**
 * Init all the click-event listeners for popup.
 */
document.addEventListener('DOMContentLoaded', function()
{
    document.getElementById('button-css-disable').addEventListener('click', function()
    {
        disable_css();
        update_buttons_css();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'CSS', 'off']);
    });

    document.getElementById('button-css-enable').addEventListener('click', function()
    {
        enable_css();
        update_buttons_css();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'CSS', 'on']);
    });

    document.getElementById('button-js-disable').addEventListener('click', function()
    {
        disable_javascript();
        update_buttons_javascript();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Javascript', 'off']);
    });

    document.getElementById('button-js-enable').addEventListener('click', function()
    {
        enable_javascript();
        update_buttons_javascript();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Javascript', 'on']);
    });

    document.getElementById('button-images-disable').addEventListener('click', function()
    {
        disable_images();
        update_buttons_images();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Images', 'off']);
    });

    document.getElementById('button-images-enable').addEventListener('click', function()
    {
        enable_images();
        update_buttons_images();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Images', 'on']);
    });

    document.getElementById('button-cookies-disable').addEventListener('click', function()
    {
        disable_cookies();
        update_buttons_cookies();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Cookies', 'off']);
    });

    document.getElementById('button-cookies-enable').addEventListener('click', function()
    {
        enable_cookies();
        update_buttons_cookies();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Cookies', 'on']);
    });

    document.getElementById('button-popups-disable').addEventListener('click', function()
    {
        disable_popups();
        update_buttons_popups();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Popups', 'off']);
    });

    document.getElementById('button-popups-enable').addEventListener('click', function()
    {
        enable_popups();
        update_buttons_popups();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Popups', 'on']);
    });

document.getElementById('button-ab-disable').addEventListener('click', function()
    {
        disable_ab();
        update_buttons_ab();
        show_info_box();

    });

document.getElementById('button-ab-enable').addEventListener('click', function()
    {
        enable_ab();
        update_buttons_ab();
        show_info_box();

    });

    document.getElementById('info-box-close').addEventListener('click', function()
    {
        close_info_box();
    });

    update_buttons_css();
    update_buttons_javascript();
    update_buttons_images();
    update_buttons_cookies();
    update_buttons_popups();
    update_buttons_ab();
});