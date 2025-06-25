$(document).ready(function () {
    $(function () {
        const $sidebar = $('#sidebar');
        const $toggleButton = $('#toggle-btn');
        const $toggleBtn = $('#toggle-flyout-button');
        const $menu = $('#flyout-menu-user-menu');

        $('#toggle-btn').on('click', function () {
            toggleSidebar();
        });
    
        function closeAllSubMenus() {
            $sidebar.find('.show').each(function () {
                $(this).removeClass('show');
                $(this).prev().removeClass('rotate');
            });
        }
    
        function toggleSidebar () {
            $sidebar.toggleClass('close');
            $toggleButton.toggleClass('rotate');
    
            closeAllSubMenus();
        };
    
        window.toggleSubMenu = function (button) {
            const $btn = $(button);
            const $submenu = $btn.next();
    
            if (!$submenu.hasClass('show')) {
                closeAllSubMenus();
            }
    
            $submenu.toggleClass('show');
            $btn.toggleClass('rotate');
    
            if ($sidebar.hasClass('close')) {
                $sidebar.removeClass('close');
                $toggleButton.toggleClass('rotate');
            }
        };
    
        // Flyout menu toggle
        $toggleBtn.on('click', function () {
            $menu.toggleClass('show');
        });
    
        $(document).on('click', function (e) {
            if (!$menu.is(e.target) && $menu.has(e.target).length === 0 &&
                !$toggleBtn.is(e.target) && $toggleBtn.has(e.target).length === 0) {
                $menu.removeClass('show');
            }
        });
    });
});
