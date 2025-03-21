import { apiConfig } from '@/config/api';

const banner = `
██╗  ██╗██╗   ██╗███╗   ███╗ █████╗     ███╗   ███╗██╗███████╗██████╗ ██╗   ██╗
██║ ██╔╝██║   ██║████╗ ████║██╔══██╗    ████╗ ████║██║██╔════╝██╔══██╗██║   ██║
█████╔╝ ██║   ██║██╔████╔██║███████║    ██╔████╔██║██║█████╗  ██████╔╝██║   ██║
██╔═██╗ ██║   ██║██║╚██╔╝██║██╔══██║    ██║╚██╔╝██║██║██╔══╝  ██╔══██╗██║   ██║
██║  ██╗╚██████╔╝██║ ╚═╝ ██║██║  ██║    ██║ ╚═╝ ██║██║███████╗██║  ██║╚██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝    ╚═╝     ╚═╝╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ 
`;

export function showBanner() {
    console.log('\x1b[36m%s\x1b[0m', banner);
    console.log('\x1b[32m%s\x1b[0m', '🚀 Kuma Mieru is starting...');
    console.log('\x1b[33m%s\x1b[0m', `📡 Connecting to: ${apiConfig.baseUrl}`);
    console.log('\x1b[34m%s\x1b[0m', `📄 Page ID: ${apiConfig.pageId}`);
    console.log('\n');
} 