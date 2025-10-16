import { useEffect, useState } from 'react';

const ServiceWorkerUpdate = () => {
    const [showReload, setShowReload] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            // Controlla se c'è già un service worker in attesa
            navigator.serviceWorker.getRegistration().then((reg) => {
                if (reg && reg.waiting) {
                    setWaitingWorker(reg.waiting);
                    setShowReload(true);
                }
            });

            // Ascolta nuovi service workers
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });

            // Controlla periodicamente per aggiornamenti
            const checkForUpdates = () => {
                navigator.serviceWorker.getRegistration().then((reg) => {
                    if (reg) {
                        reg.update();
                    }
                });
            };

            // Controlla ogni 60 secondi
            const interval = setInterval(checkForUpdates, 60000);

            // Registra l'evento di aggiornamento trovato
            navigator.serviceWorker.register('/service_worker.js').then((reg) => {
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                setWaitingWorker(newWorker);
                                setShowReload(true);
                            }
                        });
                    }
                });
            });

            return () => clearInterval(interval);
        }
    }, []);

    const reloadPage = () => {
        if (waitingWorker) {
            waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        }
        setShowReload(false);
    };

    if (!showReload) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <span>🔄 Nuova versione disponibile!</span>
            <button
                onClick={reloadPage}
                style={{
                    backgroundColor: 'white',
                    color: '#4CAF50',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}
            >
                Aggiorna
            </button>
        </div>
    );
};

export default ServiceWorkerUpdate;