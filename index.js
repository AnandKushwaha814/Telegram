const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");

let addTwoNo = `
  #include<iostream.h>
  using namespace std;
  
  int main() {
  int a,b,res;
  cout<<"Enter value of a: ";
  cin>>a;
  cout<<"Enter the value of b: ";
  cin>>b;
  res=a+b;
  cout<<a <<" + "<<b<<" = " <<res;
  return 0;
  
}`;

const bot = new Telegraf("7262764460:AAGPOlwpmcRTtoOCnD8HQoqVfTj-aALwzG4"); // Add your bot token here
const openWeatherApiKey = "86d65bb5184b93a24807398a4ea8862f";

// Start command
bot.start((ctx) => {
  return ctx.reply(
    "Welcome to the coding bot! Please choose one of the following options:",
    Markup.inlineKeyboard([
      [Markup.button.callback("🌦️ Get Weather", "weather")],
      [Markup.button.callback("📖 Get Coding Tips", "coding_tips")],
      [Markup.button.callback("👨‍🏫 Visit My Profile", "visit_profile")],
      [Markup.button.callback("🧑‍💻 Visit GitHub Profile", "GitHub_profile")],
    ])
  );
});

// Weather command
bot.action("weather", (ctx) => {
  ctx.reply(
    "Please provide a city name using the command: /weather {cityname}"
  );
});

// Handle /weather command
bot.command("weather", async (ctx) => {
  const cityName = ctx.message.text.split(" ").slice(1).join(" ");
  if (!cityName) {
    return ctx.reply("Please provide a city name. e.g., /weather mumbai");
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openWeatherApiKey}&units=metric`
    );
    const weatherData = response.data;
    const cityNameFormatted = weatherData.name;
    const weatherDescription = weatherData.weather[0].description;
    const temperature = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const feelsLike = weatherData.main.feels_like;
    const tempMin = weatherData.main.temp_min;
    const tempMax = weatherData.main.temp_max;
    const pressure = weatherData.main.pressure;

    const message = `🌤️ Current Weather in ${cityNameFormatted}:
    ☁️ Sky: ${weatherDescription}.
    🌡️ Temperature: ${temperature}°C.
    💧 Humidity: ${humidity}%.
    🌬️ Feels like: ${feelsLike}°C.
    🌡️ Min Temperature: ${tempMin}°C.
    🌡️ Max Temperature: ${tempMax}°C.
    🌀 Pressure: ${pressure}hPa.`;

    ctx.reply(message);
  } catch (error) {
    console.error(error);
    ctx.reply(
      "The location doesn't exist in our API. Please try a different city name!"
    );
  }
});

// Coding tips (you can expand this feature later)
bot.action("coding_tips", (ctx) => {
  ctx.reply("Please provide the command: /addTwoNo For adding two no");
});
bot.command("addTwoNo", (ctx) => {
  ctx.reply(addTwoNo);
});

// Profile Visiting
bot.action("visit_profile", (ctx) => {
  ctx.reply("Please provide the command: /Profile For visiting");
});

bot.command("Profile", (ctx) => {
  ctx
    .reply(
      "Please click this link to visit my profile: https://anand-kushwaha.netlify.app/"
    )
    .then(() => {
      ctx.reply("Thanks for visiting my profile!");
    });
});

bot.action("GitHub_profile", (ctx) => {
  ctx.reply(
    "Please provide the command: /GitHubProfile For visiting GitHub Profile"
  );
});

bot.command("GitHubProfile", (ctx) => {
  ctx
    .reply(
      "Please click this link to visit my GitHub profile: https://github.com/AnandKushwaha814"
    )
    .then(() => {
      ctx.reply("Thanks for visiting my GitHub profile!");
    });
});
// Clear command to reset the conversation
// Clear command to reset the conversation and delete messages
bot.command("clear", async (ctx) => {
  try {
    // Delete all bot-related messages in the chat
    const chatId = ctx.chat.id;
    const messageId = ctx.message.message_id;

    // Simulate deleting previous messages (delete messages after /clear command)
    for (let i = messageId; i > 0; i--) {
      await ctx.deleteMessage(i).catch((err) => console.log(err));
    }

    // Re-display the home menu (same as in the start command)
    return ctx.reply(
      "Welcome back to the coding bot! Please choose one of the following options:",
      Markup.inlineKeyboard([
        [Markup.button.callback("🌦️ Get Weather", "weather")],
        [Markup.button.callback("📖 Get Coding Tips", "coding_tips")],
        [Markup.button.callback("👨‍🏫 Visit My Profile", "visit_profile")],
      ])
    );
  } catch (error) {
    console.log("Error clearing chat:", error);
    ctx.reply("Sorry, I couldn't clear the chat history.");
  }
});

bot.launch();
