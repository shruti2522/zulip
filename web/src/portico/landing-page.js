import $ from "jquery";

import macbook_image from "../../images/app-screenshots/macbook.png";
import microsoft_image from "../../images/app-screenshots/microsoft.png";
import ubuntu_image from "../../images/app-screenshots/ubuntu.png";
import android_image from "../../images/app-screenshots/zulip-android.png";
import iphone_image from "../../images/app-screenshots/zulip-iphone-rough.png";
import {page_params} from "../page_params";

import {detect_user_os} from "./tabbed-instructions";
import render_tabs from "./team";

export function path_parts() {
    return window.location.pathname.split("/").filter((chunk) => chunk !== "");
}

const hello_events = function () {
    function get_new_rand(oldRand, max) {
        const newRand = Math.floor(Math.random() * max);
        return newRand === oldRand ? get_new_rand(newRand, max) : newRand;
    }

    function get_random_item_from_array(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    const current_clint_logo_class_names = new Set([
        "client-logos__logo_akamai",
        "client-logos__logo_tum",
        "client-logos__logo_wikimedia",
        "client-logos__logo_rust",
        "client-logos__logo_dr_on_demand",
        "client-logos__logo_maria",
    ]);
    const future_logo_class_names = new Set([
        "client-logos__logo_pilot",
        "client-logos__logo_recurse",
        "client-logos__logo_level_up",

        "client-logos__logo_layershift",
        "client-logos__logo_julia",
        "client-logos__logo_ucsd",
        "client-logos__logo_lean",
        "client-logos__logo_asciidoc",
    ]);
    let current_clint_logo_class_namesIndex = 0;
    function update_client_logo() {
        if (document.hidden) {
            return;
        }
        const logos = [...document.querySelectorAll("[class^='client-logos__']")];
        current_clint_logo_class_namesIndex = get_new_rand(
            current_clint_logo_class_namesIndex,
            logos.length,
        );
        const el = logos[current_clint_logo_class_namesIndex];

        const oldClass = el.className;
        el.className = "";
        current_clint_logo_class_names.delete(oldClass);
        const newClass = get_random_item_from_array([...future_logo_class_names.values()]);
        future_logo_class_names.delete(newClass);
        el.className = newClass;
        current_clint_logo_class_names.add(newClass);
        future_logo_class_names.add(oldClass);
    }
    setInterval(update_client_logo, 2500);
};

const apps_events = function () {
    const info = {
        windows: {
            image: microsoft_image,
            alt: "Windows",
            description:
                "Zulip for Windows is even better than Zulip on the web, with a cleaner look, tray integration, native notifications, and support for multiple Zulip accounts.",
            download_link: "/apps/download/windows",
            show_instructions: true,
            install_guide: "/help/desktop-app-install-guide",
            app_type: "desktop",
        },
        mac: {
            image: macbook_image,
            alt: "macOS",
            description:
                "Zulip on macOS is even better than Zulip on the web, with a cleaner look, tray integration, native notifications, and support for multiple Zulip accounts.",
            download_link: "/apps/download/mac",
            mac_arm64_link: "/apps/download/mac-arm64",
            show_instructions: true,
            install_guide: "/help/desktop-app-install-guide",
            app_type: "desktop",
        },
        android: {
            image: android_image,
            alt: "Android",
            description: "Zulip's native Android app makes it easy to keep up while on the go.",
            show_instructions: false,
            play_store_link: "https://play.google.com/store/apps/details?id=com.zulipmobile",
            download_link: "https://github.com/zulip/zulip-mobile/releases/latest",
            app_type: "mobile",
        },
        ios: {
            image: iphone_image,
            alt: "iOS",
            description: "Zulip's native iOS app makes it easy to keep up while on the go.",
            show_instructions: false,
            app_store_link: "https://itunes.apple.com/us/app/zulip/id1203036395",
            app_type: "mobile",
        },
        linux: {
            image: ubuntu_image,
            alt: "Linux",
            description:
                "Zulip on the Linux desktop is even better than Zulip on the web, with a cleaner look, tray integration, native notifications, and support for multiple Zulip accounts.",
            download_link: "/apps/download/linux",
            show_instructions: true,
            install_guide: "/help/desktop-app-install-guide",
            app_type: "desktop",
        },
    };

    let version;

    function get_version_from_path() {
        let result;
        const parts = path_parts();

        for (const version of Object.keys(info)) {
            if (parts.includes(version)) {
                result = version;
            }
        }

        result = result || detect_user_os();
        return result;
    }

    const update_page = function () {
        const $download_instructions = $(".download-instructions");
        const $third_party_apps = $("#third-party-apps");
        const $download_android_apk = $("#download-android-apk");
        const $download_from_google_play_store = $(".download-from-google-play-store");
        const $download_from_apple_app_store = $(".download-from-apple-app-store");
        const $download_from_microsoft_store = $("#download-from-microsoft-store");
        const $download_mac_arm64 = $("#download-mac-arm64");
        const $desktop_download_link = $(".desktop-download-link");
        const version_info = info[version];

        $(".info .platform").text(version_info.alt);
        $(".info .description").text(version_info.description);
        $desktop_download_link.attr("href", version_info.download_link);
        $download_from_google_play_store.attr("href", version_info.play_store_link);
        $download_from_apple_app_store.attr("href", version_info.app_store_link);
        $download_android_apk.attr("href", version_info.download_link);
        $download_mac_arm64.attr("href", version_info.mac_arm64_link);
        $(".image img").addClass(`app-screenshot-${version_info.app_type}`);
        $(".image img").attr("src", version_info.image);
        $download_instructions.find("a").attr("href", version_info.install_guide);

        $download_instructions.toggle(version_info.show_instructions);

        $third_party_apps.toggle(version_info.app_type === "desktop");
        $desktop_download_link.toggle(version_info.app_type === "desktop");
        $download_android_apk.toggle(version === "android");
        $download_from_google_play_store.toggle(version === "android");
        $download_from_apple_app_store.toggle(version === "ios");
        $download_from_microsoft_store.toggle(version === "windows");
        $download_mac_arm64.toggle(version === "mac");
    };

    // init
    version = get_version_from_path();
    update_page();
};

const events = function () {
    if (path_parts().includes("apps")) {
        apps_events();
    }

    if (path_parts().includes("hello")) {
        hello_events();
    }
};

$(() => {
    // Set up events / categories / search
    events();

    if (window.location.pathname === "/team/") {
        const contributors = page_params.contributors;
        delete page_params.contributors;
        render_tabs(contributors);
    }

    // Source: https://stackoverflow.com/questions/819416/adjust-width-and-height-of-iframe-to-fit-with-content-in-it
    // Resize tweet to avoid overlapping with image. Since tweet uses an iframe which doesn't adjust with
    // screen resize, we need to manually adjust its width.

    function resize_iframe_to_fit_content(iFrame) {
        $(iFrame).width("38vw");
    }

    window.addEventListener("resize", () => {
        const iframes = document.querySelectorAll(".twitter-tweet iframe");
        for (const iframe of iframes) {
            resize_iframe_to_fit_content(iframe);
        }
    });
});

// Scroll to anchor link when clicked. Note that help.js has a similar
// function; this file and help.js are never included on the same
// page.
$(document).on("click", ".markdown h1, .markdown h2, .markdown h3", function () {
    window.location.hash = $(this).attr("id");
});
