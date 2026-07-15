// URL вашего Google Apps Script Web App
// ЗАМЕНИТЕ НА СВОЙ URL ПОСЛЕ НАСТРОЙКИ
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/ВАШ_ID/exec';

// Синхронизация данных
async function syncData() {
    const data = loadData();
    const syncBtn = document.getElementById('sync-btn');
    
    syncBtn.textContent = '⏳ Синхронизация...';
    syncBtn.disabled = true;
    
    try {
        // Форматируем данные для Google Sheets
        const rows = data.map(item => ({
            id: item.id,
            name: item.name,
            time: item.time,
            price: item.values.join('+'),
            quantity: calculateSum(item.values)
        }));
        
        // Отправляем в Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: rows })
        });
        
        // Сохраняем время последней синхронизации
        localStorage.setItem('last_sync', new Date().toISOString());
        
        alert('✅ Данные успешно синхронизированы!');
        checkSyncStatus();
        
    } catch (error) {
        alert('❌ Ошибка синхронизации: ' + error.message);
    } finally {
        syncBtn.textContent = '🔄 Синхронизировать данные';
        syncBtn.disabled = false;
    }
}

// Автоматическая синхронизация при появлении интернета
window.addEventListener('online', async () => {
    const lastSync = localStorage.getItem('last_sync');
    const hasData = localStorage.getItem('shop188_data');
    
    if (hasData && (!lastSync || new Date(lastSync) < new Date(Date.now() - 3600000))) {
        if (confirm('🌐 Интернет появился! Синхронизировать данные?')) {
            await syncData();
        }
    }
});
