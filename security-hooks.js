module.exports = (app, BrowserWindow) => {
  app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event) => {
      event.preventDefault();
    });
    
    contents.setWindowOpenHandler(() => {
      return { action: 'deny' };
    });
  });
};