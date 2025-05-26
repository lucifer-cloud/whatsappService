const updateStatus = async (status) => {
  try {
    await fetch(process.env.SKINERA_HOST + '/api/whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        CurrentStatus: status,
      }),
    });
    console.log(`📤 Status updated to ${status}`);
  } catch (err) {
    console.error(`❌ Failed to update status to ${status}:`, err);
  }
};

module.exports = updateStatus;
